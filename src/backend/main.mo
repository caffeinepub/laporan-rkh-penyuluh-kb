import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Array "mo:core/Array";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

// Use migration to upgrade from original actor.

actor {
  type UserRole = AccessControl.UserRole;

  // Extended with optional tandaTangan field.
  type UserProfile = {
    nama : Text;
    nip : Text;
    wilayahKerja : Text;
    unitKerja : Text;
    jabatan : Text;
    nomorHp : Text;
    tandaTangan : ?Text; // base64 data URL of signature image
  };

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

  // Token entry type for getAllUserTokens response
  type UserTokenEntry = {
    user : Principal;
    token : Text;
  };

  // Original actor state.
  var nextReportId = 1;
  let rkhReports = Map.empty<Nat, RKHReport>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  // Token storage: Principal -> unique token string
  let userTokens = Map.empty<Principal, Text>();

  // Prefabricated authorization component
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Get caller's user profile.
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view profiles");
    };
    userProfiles.get(caller);
  };

  // Save/update caller's user profile.
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Get another user's profile (by admin or self only).
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Set user's role (admin only).
  public shared ({ caller }) func setUserRole(user : Principal, newRole : UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, newRole);
  };

  // Get all user profiles (admin only).
  public query ({ caller }) func getAllUserProfiles() : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can view all user profiles");
    };
    userProfiles.values().toArray();
  };

  // --- Token Management ---

  // Admin sets a unique token for a user.
  public shared ({ caller }) func setUserToken(user : Principal, token : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can set user tokens");
    };
    userTokens.add(user, token);
  };

  // Admin gets a specific user's token.
  public query ({ caller }) func getUserToken(user : Principal) : async ?Text {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view user tokens");
    };
    userTokens.get(user);
  };

  // Admin gets all user tokens.
  public query ({ caller }) func getAllUserTokens() : async [UserTokenEntry] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view all user tokens");
    };
    userTokens.entries().map(func(e) : UserTokenEntry { { user = e.0; token = e.1 } }).toArray();
  };

  // User validates their own token. Returns true if token matches.
  public query ({ caller }) func validateUserToken(token : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can validate tokens");
    };
    switch (userTokens.get(caller)) {
      case (null) { false };
      case (?stored) { stored == token };
    };
  };

  // Create new RKH report (must have user profile).
  public shared ({ caller }) func createRKHReport(input : {
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

    let report : RKHReport = {
      id = nextReportId;
      user = caller;
      tanggal = input.tanggal;
      kegiatan = input.kegiatan;
      sasaran = input.sasaran;
      jumlahSasaran = input.jumlahSasaran;
      lokasi = input.lokasi;
      hasilKegiatan = input.hasilKegiatan;
      keterangan = input.keterangan;
      createdAt = Time.now();
    };

    rkhReports.add(nextReportId, report);
    nextReportId += 1;
    report;
  };

  // Get reports (admin sees all, regular users see own reports).
  public query ({ caller }) func getReports() : async [RKHReport] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view reports");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    rkhReports.values().filter(
      func(report) {
        isAdmin or report.user == caller;
      }
    ).toArray().sort(
      func(a, b) { Text.compare(a.tanggal, b.tanggal) }
    );
  };

  // Filter reports by user id (admin or self only).
  public query ({ caller }) func filterReportsByUser(user : Principal) : async [RKHReport] {
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own reports");
    };
    rkhReports.values().filter(func(report) { report.user == user }).toArray();
  };

  // Filter reports by user id and month (admin or self only).
  public query ({ caller }) func filterReportsByUserAndMonth(user : Principal, month : Text) : async [RKHReport] {
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own reports");
    };
    rkhReports.values().filter(
      func(report) {
        report.user == user and report.tanggal.startsWith(#text month);
      }
    ).toArray();
  };

  // Filter reports by user id, month, year (admin or self only).
  public query ({ caller }) func filterReportsByUserAndMonthYear(user : Principal, month : Text, year : Text) : async [RKHReport] {
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own reports");
    };
    rkhReports.values().filter(
      func(report) {
        report.user == user and report.tanggal.startsWith(#text month) and report.tanggal.endsWith(#text year);
      }
    ).toArray();
  };

  // Filter by user id and year (admin or self only).
  public query ({ caller }) func filterReportsByUserAndYear(user : Principal, year : Text) : async [RKHReport] {
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own reports");
    };
    rkhReports.values().filter(
      func(report) {
        report.user == user and report.tanggal.endsWith(#text year);
      }
    ).toArray();
  };

  // General report query filter.
  public query ({ caller }) func queryReports(tanggal : ?Text, bulan : ?Text, tahun : ?Text, user : ?Principal) : async [RKHReport] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view reports");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let reports = List.empty<RKHReport>();

    rkhReports.values().forEach(
      func(r) {
        // Non-admin users can only see their own reports.
        if (not isAdmin and r.user != caller) {
          return;
        };

        let isMatch = switch (tanggal, bulan, tahun, user) {
          case (?tanggal, _, _, _) {
            r.tanggal == tanggal
          };
          case (_, ?bulan, _, _) {
            r.tanggal.startsWith(#text bulan);
          };
          case (_, _, ?tahun, _) { r.tanggal.startsWith(#text tahun) };
          case (_, _, _, ?filterUser) {
            // Non-admin users can only filter by reviewer (themselves)
            if (not isAdmin and filterUser != caller) {
              false;
            } else {
              r.user == filterUser };
          };
          case (null, null, null, null) { true };
        };
        if (isMatch) { reports.add(r) };
      }
    );

    // Sort reports by tanggal
    reports.toArray().sort(
      func(a, b) { Text.compare(a.tanggal, b.tanggal) }
    );
  };

  // Query for specific year.
  public query ({ caller }) func queryReportsYearly(filterYear : Text) : async [RKHReport] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view reports");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let filtered = rkhReports.values().filter(
      func(r) {
        (isAdmin or r.user == caller) and r.tanggal.startsWith(#text filterYear);
      }
    );
    filtered.toArray().sort(
      func(a, b) { Text.compare(a.tanggal, b.tanggal) }
    );
  };

  // Get specific report by id (admin or owner only)
  public query ({ caller }) func getReportById(reportId : Nat) : async RKHReport {
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

  type ReportUpdate = {
    id : Nat;
    tanggal : Text;
    kegiatan : Text;
    sasaran : Text;
    jumlahSasaran : Nat;
    lokasi : Text;
    hasilKegiatan : Text;
    keterangan : ?Text;
    createdAt : Int;
  };

  // Save new report version (must be report owner)
  public shared ({ caller }) func updateReport(reports : [RKHReport]) : async () {
    for (report in reports.values()) {
      switch (rkhReports.get(report.id)) {
        case (null) {
          Runtime.trap("Report not found");
        };
        case (?existing) {
          if (not (existing.user == caller)) {
            Runtime.trap("Unauthorized: Cannot update reports for other users");
          };
        };
      };
    };

    let toUpdate = reports.map(func(r) { r.id });
    for (newReport in reports.values()) {
      rkhReports.add(newReport.id, newReport);
    };
  };

  // Add report (must own report).
  public shared ({ caller }) func addReport(report : RKHReport) : async () {
    switch (rkhReports.get(report.id)) {
      case (null) {
        Runtime.trap("Report not found");
      };
      case (?existing) {
        if (not (existing.user == caller)) {
          Runtime.trap("Unauthorized: Cannot create reports for other users");
        };
      };
    };
    rkhReports.add(report.id, report);
  };

  // Validate numaiIndicator input is not empty.
  public func isValidNumaiIndicator(numaiIndicator : [Int]) : async Bool {
    not numaiIndicator.isEmpty();
  };
};
