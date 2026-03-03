import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";



actor {
  type Letter = {
    id : Nat;
    to : Text;
    from : Text;
    title : Text;
    body : Text;
    bouquet : Text;
    theme : Text;
    createdAt : Int;
  };

  module Letter {
    public func compareByNewestFirst(l1 : Letter, l2 : Letter) : Order.Order {
      Int.compare(l2.createdAt, l1.createdAt);
    };
  };

  var nextId = 0;
  let letters = Map.empty<Nat, Letter>();

  public shared ({ caller }) func createLetter(
    to : Text,
    from : Text,
    title : Text,
    body : Text,
    bouquet : Text,
    theme : Text,
  ) : async Nat {
    let id = nextId;
    let letter : Letter = {
      id;
      to;
      from;
      title;
      body;
      bouquet;
      theme;
      createdAt = Time.now();
    };
    letters.add(id, letter);
    nextId += 1;
    id;
  };

  public query ({ caller }) func getLetters() : async [Letter] {
    letters.values().toArray().sort(Letter.compareByNewestFirst);
  };

  public query ({ caller }) func getLetter(id : Nat) : async ?Letter {
    letters.get(id);
  };

  public shared ({ caller }) func deleteLetter(id : Nat) : async () {
    if (not letters.containsKey(id)) {
      Runtime.trap("Letter not found");
    };
    letters.remove(id);
  };
};
