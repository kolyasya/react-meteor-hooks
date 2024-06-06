import { Meteor } from 'meteor/meteor';
import { Link, LinksCollection } from '/imports/api/links';

async function insertLink({ title, url }: Pick<Link, 'title' | 'url'>) {
  await LinksCollection.insertAsync({ title, url, createdAt: new Date() });
}

Meteor.startup(async () => {
  // If the Links collection is empty, add some data.
  if ((await LinksCollection.find().countAsync()) === 0) {
    await insertLink({
      title: 'Do the Tutorial',
      url: 'https://www.meteor.com/tutorials/react/creating-an-app',
    });

    await insertLink({
      title: 'Follow the Guide',
      url: 'https://guide.meteor.com',
    });

    await insertLink({
      title: 'Read the Docs',
      url: 'https://docs.meteor.com',
    });

    await insertLink({
      title: 'Discussions',
      url: 'https://forums.meteor.com',
    });
  }

  // We publish the entire Links collection to all clients.
  // In order to be fetched in real-time to the clients
  Meteor.publish('links', function () {
    return LinksCollection.find();
  });

  Meteor.methods({
    methodWithResult: async function (...params) {
      this.unblock();
      Meteor._sleepForMs(1500);

      return {
        date: new Date(),
        value: 'Good night',
        params,
      };
    },
    methodWithError: function () {
      this.unblock();
      Meteor._sleepForMs(3000);

      throw new Meteor.Error(
        500,
        'Something is wrong on a server. Debug please!'
      );
    },
  });
});
