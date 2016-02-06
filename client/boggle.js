Session.setDefault('playing', true);
Session.setDefault('playing', false);

Template.boggle.helpers({
  playing: function () {
    return Session.get('playing');
  },
  isChallenge: function () {
    return Session.get('isChallenge');
  },

});
