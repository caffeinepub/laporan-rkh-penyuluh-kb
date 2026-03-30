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

actor {
  type UserRole = AccessControl.UserRole;

  type UserProfile = {
    nama : Text;
    nip : Text;
    wilayahKerja : Text;
    unitKerja : Text;
    jabatan : Text;
    nomorHp : Text;
    tandaTangan : ?Text;
  };

  // Internal stored type
  type RKHReportStored = {
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

  // Public API type
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
    lampiran : ?Text;
    createdAt : Int;
  };

  type UserTokenEntry = {
    user : Principal;
    token : Text;
  };

  type UserProfileWithPrincipal = {
    user : Principal;
    profile : UserProfile;
  };

  var nextReportId = 1;
  let rkhReports = Map.empty<Nat, RKHReportStored>();
  let rkhLampiran = Map.empty<Nat, Text>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let userTokens = Map.empty<Principal, Text>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  func withLampiran(r : RKHReportStored) : RKHReport {
    {
      id = r.id;
      user = r.user;
      tanggal = r.tanggal;
      kegiatan = r.kegiatan;
      sasaran = r.sasaran;
      jumlahSasaran = r.jumlahSasaran;
      lokasi = r.lokasi;
      hasilKegiatan = r.hasilKegiatan;
      keterangan = r.keterangan;
      lampiran = rkhLampiran.get(r.id);
      createdAt = r.createdAt;
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func setUserRole(user : Principal, newRole : UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, newRole);
  };

  public query ({ caller }) func getAllUserProfiles() : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can view all user profiles");
    };
    userProfiles.values().toArray();
  };

  public query ({ caller }) func getAllUserProfilesWithPrincipals() : async [UserProfileWithPrincipal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can view all user profiles");
    };
    userProfiles.entries().map(func(e) : UserProfileWithPrincipal { { user = e.0; profile = e.1 } }).toArray();
  };

  public shared ({ caller }) func setUserToken(user : Principal, token : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can set user tokens");
    };
    userTokens.add(user, token);
  };

  public query ({ caller }) func getUserToken(user : Principal) : async ?Text {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view user tokens");
    };
    userTokens.get(user);
  };

  public query ({ caller }) func getAllUserTokens() : async [UserTokenEntry] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view all user tokens");
    };
    userTokens.entries().map(func(e) : UserTokenEntry { { user = e.0; token = e.1 } }).toArray();
  };

  public query ({ caller }) func validateUserToken(token : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can validate tokens");
    };
    switch (userTokens.get(caller)) {
      case (null) { false };
      case (?stored) { stored == token };
    };
  };

  public shared ({ caller }) func createRKHReport(input : {
    tanggal : Text;
    kegiatan : Text;
    sasaran : Text;
    jumlahSasaran : Nat;
    lokasi : Text;
    hasilKegiatan : Text;
    keterangan : ?Text;
    lampiran : ?Text;
  }) : async RKHReport {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can create reports");
    };

    let stored : RKHReportStored = {
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

    rkhReports.add(nextReportId, stored);
    switch (input.lampiran) {
      case (null) {};
      case (?lmp) { rkhLampiran.add(nextReportId, lmp) };
    };
    nextReportId += 1;
    withLampiran(stored);
  };

  public query ({ caller }) func getReports() : async [RKHReport] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view reports");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    rkhReports.values().filter(
      func(r) { isAdmin or r.user == caller }
    ).map(withLampiran).toArray().sort(
      func(a, b) { Text.compare(a.tanggal, b.tanggal) }
    );
  };

  public query ({ caller }) func filterReportsByUser(user : Principal) : async [RKHReport] {
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own reports");
    };
    rkhReports.values().filter(func(r) { r.user == user }).map(withLampiran).toArray();
  };

  public query ({ caller }) func filterReportsByUserAndMonth(user : Principal, month : Text) : async [RKHReport] {
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own reports");
    };
    rkhReports.values().filter(
      func(r) { r.user == user and r.tanggal.startsWith(#text month) }
    ).map(withLampiran).toArray();
  };

  public query ({ caller }) func filterReportsByUserAndMonthYear(user : Principal, month : Text, year : Text) : async [RKHReport] {
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own reports");
    };
    rkhReports.values().filter(
      func(r) {
        r.user == user and r.tanggal.startsWith(#text month) and r.tanggal.endsWith(#text year);
      }
    ).map(withLampiran).toArray();
  };

  public query ({ caller }) func filterReportsByUserAndYear(user : Principal, year : Text) : async [RKHReport] {
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own reports");
    };
    rkhReports.values().filter(
      func(r) { r.user == user and r.tanggal.endsWith(#text year) }
    ).map(withLampiran).toArray();
  };

  public query ({ caller }) func queryReports(tanggal : ?Text, bulan : ?Text, tahun : ?Text, user : ?Principal) : async [RKHReport] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view reports");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let results = List.empty<RKHReport>();

    rkhReports.values().forEach(
      func(r) {
        if (not isAdmin and r.user != caller) { return };

        let isMatch = switch (tanggal, bulan, tahun, user) {
          case (?t, _, _, _) { r.tanggal == t };
          case (_, ?b, _, _) { r.tanggal.startsWith(#text b) };
          case (_, _, ?y, _) { r.tanggal.startsWith(#text y) };
          case (_, _, _, ?filterUser) {
            if (not isAdmin and filterUser != caller) { false }
            else { r.user == filterUser };
          };
          case (null, null, null, null) { true };
        };
        if (isMatch) { results.add(withLampiran(r)) };
      }
    );

    results.toArray().sort(
      func(a, b) { Text.compare(a.tanggal, b.tanggal) }
    );
  };

  public query ({ caller }) func queryReportsYearly(filterYear : Text) : async [RKHReport] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view reports");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    rkhReports.values().filter(
      func(r) { (isAdmin or r.user == caller) and r.tanggal.startsWith(#text filterYear) }
    ).map(withLampiran).toArray().sort(
      func(a, b) { Text.compare(a.tanggal, b.tanggal) }
    );
  };

  public query ({ caller }) func getReportById(reportId : Nat) : async RKHReport {
    switch (rkhReports.get(reportId)) {
      case (null) { Runtime.trap("Report not found") };
      case (?r) {
        if (not AccessControl.isAdmin(accessControlState, caller) and not (r.user == caller)) {
          Runtime.trap("Unauthorized: Can only view your own reports");
        };
        withLampiran(r);
      };
    };
  };

  public shared ({ caller }) func updateReport(reports : [RKHReport]) : async () {
    for (report in reports.values()) {
      switch (rkhReports.get(report.id)) {
        case (null) { Runtime.trap("Report not found") };
        case (?existing) {
          if (not AccessControl.isAdmin(accessControlState, caller) and not (existing.user == caller)) {
            Runtime.trap("Unauthorized: Cannot update reports for other users");
          };
        };
      };
    };

    for (r in reports.values()) {
      let stored : RKHReportStored = {
        id = r.id;
        user = r.user;
        tanggal = r.tanggal;
        kegiatan = r.kegiatan;
        sasaran = r.sasaran;
        jumlahSasaran = r.jumlahSasaran;
        lokasi = r.lokasi;
        hasilKegiatan = r.hasilKegiatan;
        keterangan = r.keterangan;
        createdAt = r.createdAt;
      };
      rkhReports.add(stored.id, stored);
      switch (r.lampiran) {
        case (null) {};
        case (?lmp) { rkhLampiran.add(r.id, lmp) };
      };
    };
  };

  // Delete a report by id — only the owner or admin can delete
  public shared ({ caller }) func deleteReport(reportId : Nat) : async () {
    switch (rkhReports.get(reportId)) {
      case (null) { Runtime.trap("Report not found") };
      case (?existing) {
        if (not AccessControl.isAdmin(accessControlState, caller) and not (existing.user == caller)) {
          Runtime.trap("Unauthorized: Cannot delete reports for other users");
        };
        ignore rkhReports.remove(reportId);
        ignore rkhLampiran.remove(reportId);
      };
    };
  };

  public shared ({ caller }) func addReport(report : RKHReport) : async () {
    switch (rkhReports.get(report.id)) {
      case (null) { Runtime.trap("Report not found") };
      case (?existing) {
        if (not (existing.user == caller)) {
          Runtime.trap("Unauthorized: Cannot create reports for other users");
        };
      };
    };
    let stored : RKHReportStored = {
      id = report.id;
      user = report.user;
      tanggal = report.tanggal;
      kegiatan = report.kegiatan;
      sasaran = report.sasaran;
      jumlahSasaran = report.jumlahSasaran;
      lokasi = report.lokasi;
      hasilKegiatan = report.hasilKegiatan;
      keterangan = report.keterangan;
      createdAt = report.createdAt;
    };
    rkhReports.add(stored.id, stored);
    switch (report.lampiran) {
      case (null) {};
      case (?lmp) { rkhLampiran.add(report.id, lmp) };
    };
  };

  public func isValidNumaiIndicator(numaiIndicator : [Int]) : async Bool {
    not numaiIndicator.isEmpty();
  };
};
