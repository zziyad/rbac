class RBAC {
  constructor(roles) {
    this.roles = roles;
    this.init()
  };

  init() {
    if (typeof this.roles !== 'object') {
      throw new TypeError('Expected an object as input')
    };

    const map = new Object(null);

    for (const [role] of Object.entries(this.roles)){

      map[role] = {
        can: {}
      };

      if (this.roles[role].inherits) {
        map[role].inherits = this.roles[role].inherits
      }
    
      this.roles[role].can.map((operation) => {
        if (typeof operation === 'string') map[role].can[operation] = operation;
        if (typeof operation.name === 'string' && typeof operation.when === 'function')
          map[role].can[operation.name] = operation.when;
      });


    };

    this.roles = map;
  }

  can(role, operation, params = {}) {
    //check if role exists
    if (!this.roles[role]) return false;
    
    const userRole = this.roles[role];
    //check if this role has this opertation
    if (userRole.can[operation]) {
      //Not a function so we are good
      if (typeof userRole.can[operation] !== 'function') return true;
      //If the function check passes return true 
      if (userRole.can[operation](params)) return true;
    }
    
    //check if there are any paretns
    if (!userRole.inherits || userRole.inherits.length < 1) return false;


    return userRole.inherits.some((childRole) => this.can(childRole, operation, params));
  }

}

const rbac = (roles) => new RBAC(roles);

module.exports =  { RBAC, rbac };