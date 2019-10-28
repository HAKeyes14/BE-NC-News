const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');

describe('formatDates', () => {
  it('returns an empty array when passed an empty array', () => {
    expect(formatDates([])).to.eql([]);
  });
  it('when passed an array with a single object, returns an array with that objects date formatted', () => {
    const input = [{
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: 1542284514171,
      votes: 100,
    }];
    const expected = [{
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: new Date(1542284514171),
      votes: 100,
    }];
    expect(formatDates(input)).to.eql(expected);
  });
  it('the returned array is not the passed array', () => {
    const input = [{
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: 1542284514171,
      votes: 100,
    }];
    expect(formatDates(input)).to.not.equal(input);
  });
  it('the passed array is not mutated', () => {
    const input = [{
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: 1542284514171,
      votes: 100,
    }];
    const copy = [];
    input.forEach(obj => {
      copy.push({...obj});
    })
    formatDates(input);
    expect(input).to.eql(copy);
  });
  it('returns an array of many formatted objects when passed an array of many objects', () => {
    const input = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100,
      },
      {
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        author: 'icellusedkars',
        body:
          'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
        created_at: 1416140514171,
      },
      {
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: 1289996514171,
      },
      {
        title: 'Student SUES Mitch!',
        topic: 'mitch',
        author: 'rogersop',
        body:
          'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
        created_at: 1163852514171,
      },
      {
        title: 'UNCOVERED: catspiracy to bring down democracy',
        topic: 'cats',
        author: 'rogersop',
        body: 'Bastet walks amongst us, and the cats are taking arms!',
        created_at: 1037708514171,
      }];
      const expected = [
        {
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: new Date(1542284514171),
          votes: 100,
        },
        {
          title: 'Sony Vaio; or, The Laptop',
          topic: 'mitch',
          author: 'icellusedkars',
          body:
            'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
          created_at: new Date(1416140514171),
        },
        {
          title: 'Eight pug gifs that remind me of mitch',
          topic: 'mitch',
          author: 'icellusedkars',
          body: 'some gifs',
          created_at: new Date(1289996514171),
        },
        {
          title: 'Student SUES Mitch!',
          topic: 'mitch',
          author: 'rogersop',
          body:
            'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
          created_at: new Date(1163852514171),
        },
        {
          title: 'UNCOVERED: catspiracy to bring down democracy',
          topic: 'cats',
          author: 'rogersop',
          body: 'Bastet walks amongst us, and the cats are taking arms!',
          created_at: new Date(1037708514171),
        }];
        expect(formatDates(input)).to.eql(expected);
  });
});

describe('makeRefObj', () => {
  it('returns an empty object when passed an empty array', () => {
    expect(makeRefObj([])).to.eql({});
  });
  it('returns an object with a single key-value pair when passed an array containing one object', () => {
    const input = [
      {
        article_id: 1,
        title: 'Running a Node App',
        topic: 'coding',
        author: 'jessjelly',
        body:
          'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        created_at: 1471522072389,
      }
    ];
    const expected = {
        'Running a Node App': 1
      };
    expect(makeRefObj(input)).to.eql(expected);
  });
  it('returns an object with a many key-value pairs when passed an array containing many objects', () => {
    const input = [
      {
        article_id: 1,
        title: 'A',
        topic: 'coding',
        author: 'jessjelly',
        body:
          'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        created_at: 1471522072389,
      },
      {
        article_id: 2,
        title: 'B',
        topic: 'coding',
        author: 'jessjelly',
        body:
          'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        created_at: 1471522072389,
      },
      {
        article_id: 3,
        title: 'C',
        topic: 'coding',
        author: 'jessjelly',
        body:
          'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        created_at: 1471522072389,
      },
      {
        article_id: 4,
        title: 'D',
        topic: 'coding',
        author: 'jessjelly',
        body:
          'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        created_at: 1471522072389,
      }
    ];
    const expected = {
        'A': 1,
        'B': 2,
        'C': 3,
        'D': 4
      };
    expect(makeRefObj(input)).to.eql(expected);
  });
  it('the passed array is not mutated', () => {
    const input = [
      {
        article_id: 1,
        title: 'A',
        topic: 'coding',
        author: 'jessjelly',
        body:
          'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        created_at: 1471522072389,
      },
      {
        article_id: 2,
        title: 'B',
        topic: 'coding',
        author: 'jessjelly',
        body:
          'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        created_at: 1471522072389,
      },
      {
        article_id: 3,
        title: 'C',
        topic: 'coding',
        author: 'jessjelly',
        body:
          'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        created_at: 1471522072389,
      },
      {
        article_id: 4,
        title: 'D',
        topic: 'coding',
        author: 'jessjelly',
        body:
          'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        created_at: 1471522072389,
      }
    ];
    const copy = [];
    input.forEach(obj => {
      copy.push({...obj});
    });
    makeRefObj(input);
    expect(input).to.eql(copy);
  });
});

describe('formatComments', () => {
  it('returns an empty arrray when passed an empty array', () => {
    expect(formatComments([])).to.eql([]);
  });
  it('returns an array with a single object correctly formatted when passed an array containing a single object', () => {
    const inputComments = [{
      body: 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
      belongs_to: 'The People Tracking Every Touch, Pass And Tackle in the World Cup',
      created_by: 'tickle122',
      votes: -1,
      created_at: 1468087638932,
    }];
    const refObj = {'The People Tracking Every Touch, Pass And Tackle in the World Cup': 1};
    const expected = [{
      body: 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
      article_id: 1,
      author: 'tickle122',
      votes: -1,
      created_at: new Date(1468087638932)
    }];
    expect(formatComments(inputComments, refObj)).to.eql(expected);
  });
  it('returns an array with a many object correctly formatted when passed an array containing many objects', () => {
    const inputComments = [{
      body: 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
      belongs_to: 'A',
      created_by: 'tickle122',
      votes: -1,
      created_at: 1468087638932,
    },
    {
      body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
      belongs_to: 'B',
      created_by: 'grumpy19',
      votes: 7,
      created_at: 1478813209256,
    },
    {
      body: 'Qui sunt sit voluptas repellendus sed. Voluptatem et repellat fugiat. Rerum doloribus eveniet quidem vero aut sint officiis. Dolor facere et et architecto vero qui et perferendis dolorem. Magni quis ratione adipisci error assumenda ut. Id rerum eos facere sit nihil ipsam officia aspernatur odio.',
      belongs_to: 'C',
      created_by: 'grumpy19',
      votes: 3,
      created_at: 1504183900263,
    },
    {
      body: 'Rerum voluptatem quam odio facilis quis illo unde. Ex blanditiis optio tenetur sunt. Cumque dolor ducimus et qui officia quasi non illum reiciendis.',
      belongs_to: 'A',
      created_by: 'happyamy2016',
      votes: 4,
      created_at: 1467709215383,
    }];
    const refObj = {'A': 1, 'B': 2, 'C': 3, 'D': 4};
    const expected = [{
      body: 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
      article_id: 1,
      author: 'tickle122',
      votes: -1,
      created_at: new Date(1468087638932),
    },
    {
      body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
      article_id: 2,
      author: 'grumpy19',
      votes: 7,
      created_at: new Date(1478813209256),
    },
    {
      body: 'Qui sunt sit voluptas repellendus sed. Voluptatem et repellat fugiat. Rerum doloribus eveniet quidem vero aut sint officiis. Dolor facere et et architecto vero qui et perferendis dolorem. Magni quis ratione adipisci error assumenda ut. Id rerum eos facere sit nihil ipsam officia aspernatur odio.',
      article_id: 3,
      author: 'grumpy19',
      votes: 3,
      created_at: new Date(1504183900263),
    },
    {
      body: 'Rerum voluptatem quam odio facilis quis illo unde. Ex blanditiis optio tenetur sunt. Cumque dolor ducimus et qui officia quasi non illum reiciendis.',
      article_id: 1,
      author: 'happyamy2016',
      votes: 4,
      created_at: new Date(1467709215383),
    }];
    expect(formatComments(inputComments, refObj)).to.eql(expected);
  });
  it('the returned array is not the passed array', () => {
    const inputComments = [{
      body: 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
      belongs_to: 'A',
      created_by: 'tickle122',
      votes: -1,
      created_at: 1468087638932,
    },
    {
      body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
      belongs_to: 'B',
      created_by: 'grumpy19',
      votes: 7,
      created_at: 1478813209256,
    },
    {
      body: 'Qui sunt sit voluptas repellendus sed. Voluptatem et repellat fugiat. Rerum doloribus eveniet quidem vero aut sint officiis. Dolor facere et et architecto vero qui et perferendis dolorem. Magni quis ratione adipisci error assumenda ut. Id rerum eos facere sit nihil ipsam officia aspernatur odio.',
      belongs_to: 'C',
      created_by: 'grumpy19',
      votes: 3,
      created_at: 1504183900263,
    },
    {
      body: 'Rerum voluptatem quam odio facilis quis illo unde. Ex blanditiis optio tenetur sunt. Cumque dolor ducimus et qui officia quasi non illum reiciendis.',
      belongs_to: 'A',
      created_by: 'happyamy2016',
      votes: 4,
      created_at: 1467709215383,
    }];
    const refObj = {'A': 1, 'B': 2, 'C': 3, 'D': 4};
    expect(formatComments(inputComments, refObj)).to.not.equal(inputComments);
  });
  it('the passed array is not mutated', () => {
    const inputComments = [{
      body: 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
      belongs_to: 'A',
      created_by: 'tickle122',
      votes: -1,
      created_at: 1468087638932,
    },
    {
      body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
      belongs_to: 'B',
      created_by: 'grumpy19',
      votes: 7,
      created_at: 1478813209256,
    }];
    const refObj = {'A': 1, 'B': 2, 'C': 3, 'D': 4};
    const copy = [];
    inputComments.forEach(obj => {
      copy.push({...obj});
    });
    formatComments(inputComments, refObj);
    expect(inputComments).to.eql(copy);
  });
});
