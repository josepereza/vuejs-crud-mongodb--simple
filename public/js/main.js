const app = new Vue({
  el: '#app',
  data: {
    isUpdate: false,
    message: '',
    search: '',
    errors: {
      loginError: '',
      emailError: '',
      senhaError: ''
    },
    users: [],
    user: {
      login: '',
      email: '',
      senha: ''
    },
    currentId: ''
  },
  computed: {
    filteredUsers() {
      if(this.search) {
        return this.users.filter(user => (user.login.includes(this.search) || user.email.includes(this.search)));
      }
      return this.users;
    }
  },
  created() {
    fetch('http://173.249.39.9:3000/users').then(res => res.json()).then(json => {
        this.users = json
    })
  },
  methods: {
    save(event) {
      event.preventDefault();

      if(!this.checkForInputs()) {
        fetch('http://173.249.39.9:3000/users', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.user)
        }).then(res => res.json()).then(res => {
          this.message = res.message;
          this.getUsers();
        });
      }
    },

    get(user) {
      fetch('http://173.249.39.9:3000/user/' + user._id).then(res => res.json()).then(json => {
          this.currentId = json._id
          this.user.login = json.login
          this.user.email = json.email
          this.user.senha = json.senha
        })
      this.isUpdate = true;
    },

    update(event) {
      event.preventDefault();

      if(confirm('Deseja mesmo alterar?')) {
        fetch('http://173.249.39.9:3000/user/' + this.currentId, {
          method: 'put',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(this.user)
        }).then(res => res.json()).then(res => {
          this.message = res.message;
          this.getUsers();
        });
      } else {
        this.resetInputs(event);
        this.message = 'Alteração cancelada'
      }

      this.isUpdate = false;
    },
    remove(user) {

      if(confirm('Deseja mesmo excluir ?')){

        fetch('http://173.249.39.9:3000/user/' + user._id, {
          method: 'delete'
        }).then(res => res.json()).then(res => {
          this.message = res.message;
          this.getUsers();
        });

      } else {
        this.message = "Exclusão cancelada";
      }
    },
    getUsers() {
      fetch('http://173.249.39.9:3000/users').then(res => res.json()).
        then(json => {
          this.users = json
        })
    },
    checkForInputs() {
      var error = false;

      //Validando login
      if(!this.user.login) {
        this.errors.loginError = 'Login obrigatório';
        error = true;
      } else {
        this.errors.loginError = '';
      }

      //Validando Email
      if(!this.user.email) {
        this.errors.emailError = 'E-mail obrigatório';
        error = true;
      } else if(!this.validEmail(this.user.email)) {
        this.errors.emailError = 'E-mail inválido';
        error = true;
      } else {
        this.errors.emailError = '';
      }

      //Validando Senha
      if(!this.user.senha) {
        this.errors.senhaError = 'Senha obrigatória'
        error = true;
      } else {
          this.errors.senhaError = '';
      }

      return error;
    },
    validEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    resetInputs(event) {
      event.preventDefault();

      this.user.login = '';
      this.user.email = '';
      this.user.senha = '';
    },
    closeMessage()  {
      this.message = '';
    }
  }
})
