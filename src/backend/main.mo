import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import List "mo:core/List";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Define the UserRole and UserProfile types
  type UserRole = AccessControl.UserRole;

  type UserProfile = {
    nama : Text;
    nip : Text;
    wilayahKerja : Text;
    unitKerja : Text;
    jabatan : Text;
    nomorHp : Text;
  };

  // RKH report (daily activity plan) type
  type RKHReport = {
    id : Nat;
    user : Principal;
    tanggal : Text;
    kegiatan : Text;
    sasaran : Text;
    jumlahSasaran : Nat;
    lokasi : Text;
    hasilKegiatan : Text;
    keterangan : ?Text;
    createdAt : Int;
  };

  // Internal state
  var nextReportId = 1;
  let rkhReports = Map.empty<Nat, RKHReport>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Initialize prefabricated authorization component and include it
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Frontend-required: Get caller's profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view profiles");
    };
    userProfiles.get(caller);
  };

  // Frontend-required: Save caller's profile
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Frontend-required: Get another user's profile (admin or self only)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Update user profile (must be authenticated)
  public shared ({ caller }) func updateMyProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can update profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Get own profile (must be authenticated)
  public query ({ caller }) func getMyProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view profiles");
    };
    userProfiles.get(caller);
  };

  // Admin-only: Get all user profiles
  public query ({ caller }) func getAllUserProfiles() : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    userProfiles.values().toArray();
  };

  // Admin-only: Change user's role
  public shared ({ caller }) func setUserRole(user : Principal, newRole : UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, newRole);
  };

  // Create RKH Report (user must be registered and have profile)
  public shared ({ caller }) func createRKHReport(reportInput : {
    tanggal : Text;
    kegiatan : Text;
    sasaran : Text;
    jumlahSasaran : Nat;
    lokasi : Text;
    hasilKegiatan : Text;
    keterangan : ?Text;
  }) : async RKHReport {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can create reports");
    };
    let reportId = nextReportId;
    nextReportId += 1;

    let newReport : RKHReport = {
      id = reportId;
      user = caller;
      tanggal = reportInput.tanggal;
      kegiatan = reportInput.kegiatan;
      sasaran = reportInput.sasaran;
      jumlahSasaran = reportInput.jumlahSasaran;
      lokasi = reportInput.lokasi;
      hasilKegiatan = reportInput.hasilKegiatan;
      keterangan = reportInput.keterangan;
      createdAt = Time.now();
    };

    rkhReports.add(reportId, newReport);
    newReport;
  };

  // Query RKH Reports with filters (users see own, admins see all)
  public query ({ caller }) func queryRKHReports(filter : {
    tanggal : ?Text;
    bulan : ?Text;
    tahun : ?Text;
    user : ?Principal;
  }) : async [RKHReport] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can query reports");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let reports = List.empty<RKHReport>();

    rkhReports.values().forEach(
      func(report) {
        // Non-admins can only see their own reports
        if (not isAdmin and report.user != caller) {
          return;
        };

        let isMatch = switch (filter.tanggal, filter.bulan, filter.tahun, filter.user) {
          case (?tanggal, _, _, _) { report.tanggal == tanggal };
          case (_, ?bulan, _, _) { report.tanggal.startsWith(#text bulan) };
          case (_, _, ?tahun, _) { report.tanggal.startsWith(#text tahun) };
          case (_, _, _, ?filterUser) { 
            // Non-admins can only filter their own reports
            if (not isAdmin and filterUser != caller) {
              false;
            } else {
              report.user == filterUser;
            };
          };
          case (null, null, null, null) { true };
        };
        if (isMatch) { reports.add(report) };
      }
    );

    reports.toArray().sort(RKHReport.compareByTanggal);
  };

  // Compare reports by tanggal for sorting
  module RKHReport {
    public func compareByTanggal(a : RKHReport, b : RKHReport) : Order.Order {
      Text.compare(a.tanggal, b.tanggal);
    };
  };

  // Filter reports by user with optional month/year filters
  public query ({ caller }) func filterReports(user : Principal, monthFilter : ?Text, yearFilter : ?Text) : async [RKHReport] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can filter reports");
    };

    // Non-admins can only filter their own reports
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only filter your own reports");
    };

    let filtered = rkhReports.values().filter(
      func(report) {
        if (not (report.user == user)) { return false };
        switch (monthFilter) {
          case (?month) { if (not report.tanggal.startsWith(#text month)) { return false } };
          case (null) {};
        };
        switch (yearFilter) {
          case (?year) { if (not report.tanggal.startsWith(#text year)) { return false } };
          case (null) {};
        };
        true;
      }
    );
    filtered.toArray().sort(RKHReport.compareByTanggal);
  };

  // Get individual user's reports (authenticated)
  public query ({ caller }) func getMyReports() : async [RKHReport] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view reports");
    };
    rkhReports.values().filter(func(r) { r.user == caller }).toArray().sort(RKHReport.compareByTanggal);
  };

  // Admin-only: Get all reports by all users
  public query ({ caller }) func getAllReports() : async [RKHReport] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    rkhReports.values().toArray().sort(RKHReport.compareByTanggal);
  };

  // Get specific report by ID (owner or admin only)
  public query ({ caller }) func getReportById(reportId : Nat) : async RKHReport {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view reports");
    };

    switch (rkhReports.get(reportId)) {
      case (null) {
        Runtime.trap("Report not found");
      };
      case (?r) {
        if (not AccessControl.isAdmin(accessControlState, caller) and not (r.user == caller)) {
          Runtime.trap("Unauthorized: Can only view your own reports");
        };
        r;
      };
    };
  };

  // Update a report (must own report)
  public shared ({ caller }) func updateReport(reportId : Nat, updatedData : {
    tanggal : Text;
    kegiatan : Text;
    sasaran : Text;
    jumlahSasaran : Nat;
    lokasi : Text;
    hasilKegiatan : Text;
    keterangan : ?Text;
  }) : async RKHReport {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can update reports");
    };

    switch (rkhReports.get(reportId)) {
      case (null) {
        Runtime.trap("Report not found");
      };
      case (?existing) {
        if (not (existing.user == caller)) {
          Runtime.trap("Unauthorized: Only report owner can update");
        };
        let updatedReport : RKHReport = {
          id = reportId;
          user = caller;
          tanggal = updatedData.tanggal;
          kegiatan = updatedData.kegiatan;
          sasaran = updatedData.sasaran;
          jumlahSasaran = updatedData.jumlahSasaran;
          lokasi = updatedData.lokasi;
          hasilKegiatan = updatedData.hasilKegiatan;
          keterangan = updatedData.keterangan;
          createdAt = existing.createdAt;
        };
        rkhReports.add(reportId, updatedReport);
        updatedReport;
      };
    };
  };

  // Delete a report (must own report)
  public shared ({ caller }) func deleteReport(reportId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can delete reports");
    };

    switch (rkhReports.get(reportId)) {
      case (null) {
        Runtime.trap("Report not found");
      };
      case (?existing) {
        if (not (existing.user == caller)) {
          Runtime.trap("Unauthorized: Only report owner can delete");
        };
        rkhReports.remove(reportId);
      };
    };
  };
};
