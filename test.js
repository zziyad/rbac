const { RBAC } = require('./rbac.js');

const roles = {
  manager: {
    can: ['publish'],
    inherits: ['writer'],
  },
  writer: {
    can: ['write', {
      name: 'edit',
      when: (params) => params.user.id === params.post.owener
    }],
    inherits: ['guest']
  },
  guest: {
    can: ['read'],
  },
};

const user = {
  id: '12',
  name: 'Paul'
};

const post = {
  id: 123456,
  text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.',
  owener: '12',
}

const rbac = new RBAC(roles);

console.log(rbac.can('writer', 'edit', { user, post}));