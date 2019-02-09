/**
 * Created by Joe on 1/29/2019.
 */

/*=====================================================================
Group Globals
=====================================================================*/
var contactsCollection;
var groupsCollection;
var membershipsCollection;

function build_db() {
  contactsCollection = db.collection("contacts").deferredCalls(false);
  contactsCollection.insert(contactRecords);

  groupsCollection = db.collection("groups").deferredCalls(false);
  groupsCollection.insert(groupRecords);

  membershipsCollection = db.collection("memberships").deferredCalls(false);
  membershipsCollection.insert(membershipRecords);

  groupRecords.forEach(function(group) {
    membershipsCollection.update(
      {group_id: group.id},
      {group_name: group.name}
    )
  });

  contactRecords.forEach(function(contact) {
    membershipsCollection.update(
      {contact_id: contact.id},
      {contact_name: commonName(contact.name)}
    )
  });
}
