import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  // Original user profile type (without signature field)
  type OldUserProfile = {
    nama : Text;
    nip : Text;
    wilayahKerja : Text;
    unitKerja : Text;
    jabatan : Text;
    nomorHp : Text;
    // no tandaTangan
  };

  // Extended user profile type (with signature field)
  type NewUserProfile = {
    nama : Text;
    nip : Text;
    wilayahKerja : Text;
    unitKerja : Text;
    jabatan : Text;
    nomorHp : Text;
    tandaTangan : ?Text; // new signature field
  };

  // Original actor type
  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    rkhReports : Map.Map<Nat, {
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
    }>;
    nextReportId : Nat;
  };

  // New actor type
  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
    rkhReports : Map.Map<Nat, {
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
    }>;
    nextReportId : Nat;
  };

  // Migration function called by the main actor 
  public func run(old : OldActor) : NewActor {
    // Convert old profiles to new ones (with signature field defaulted)
    let newProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_k, oldProfile) { { oldProfile with tandaTangan = null } }
    );
    // Return new actor state
    {
      old with
      userProfiles = newProfiles
    };
  };
};
