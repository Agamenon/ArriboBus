
// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ArriboBus
// Model: Favorite
// ==========================================================================

ArriboBus.Favorite = M.Model.create({

    /* Define the name of your model. Do not delete this property! */
    __name__: 'Favorite',

    /* Sample model properties: */

    Nombre: M.Model.attr('String',{
            isRequired:YES
    }),
    
    Linea: M.Model.attr('String',{
        isRequired:YES
    }),

    Ramal: M.Model.attr('String', {
    isRequired:YES
    }),

    Parada: M.Model.attr('String', {
    isRequired:YES
    }),

    Sentido: M.Model.attr('String', {
    isRequired:YES
    }),

    Tiempo: M.Model.attr('String', {
    isRequired:NO
    }),
    
    User: M.Model.hasOne('User',{
    	isRequired:YES
    })

}, M.DataProviderLocalStorage);

// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ArriboBus
// Model: Search
// ==========================================================================

ArriboBus.Search = M.Model.create({

    /* Define the name of your model. Do not delete this property! */
    __name__: 'Search',

    /* Sample model properties: */

    Linea: M.Model.attr('String',{
            isRequired:YES
    }),

    Ramal: M.Model.attr('String', {
        isRequired:YES
    }),

    Parada: M.Model.attr('String', {
        isRequired:YES
    }),
    
    Sentido: M.Model.attr('String', {
        isRequired:YES
    }),
    
    Tiempo: M.Model.attr('String', {
        isRequired:NO
    })

}, M.DataProviderLocalStorage);

// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ArriboBus
// Model: User
// ==========================================================================

ArriboBus.User = M.Model.create({

    /* Define the name of your model. Do not delete this property! */
    __name__: 'User',

    /* Sample model properties: */

    nombre: M.Model.attr('String',{
            isRequired:YES
    }),

    apellido: M.Model.attr('String', {
        isRequired:YES
    }),

    email: M.Model.attr('String', {
        isRequired:YES,
        validators: [M.EmailValidator]
    }),
    
    password: M.Model.attr('String', {
        isRequired:YES
    })

}, M.DataProviderLocalStorage);

// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ArriboBus
// Controller: FavoriteController
// ==========================================================================

ArriboBus.FavoriteController = M.Controller.extend({

    /* sample controller property */
    last_search: '',
    list_favorite:[],

    /*
    * Sample function
    * To handle the first load of a page.
    */
    init: function(isFirstLoad) {
        if(isFirstLoad) {
            /* do something here, when page is loaded the first time. */
        }
    },
    
    getLastSearch: function(){
    	this.set('last_search',ArriboBus.SearchController.getLastSerach());
    },
    
    add: function(){
    	var form = M.ViewManager.getView(ArriboBus.NewFavoritePage, 'frm_favorite');
    	if(form.validate())
    	{
    		var data = form.getFormValues();
    		if(this.checkNameExist(data.Nombre))
    		{
    			M.DialogView.alert({
        		    title: 'Error!',
        		    message: 'Ya existe un Favorito con ese Nombre.',
        		    confirmButtonValue: 'Ok',
					callbacks: {
						confirm: {
							action: function() {
								return false;
							}
						}
					}
    			});
    			return false;
    		}
    		data.User =ArriboBus.LoginController.get('current_user');
    		ArriboBus.Favorite.createRecord(data).save();
    		this.switchToTabHome();
    	}
    },
    
    checkNameExist:function(name){
    	var usuario = ArriboBus.LoginController.get('current_user');
    	var favorito = ArriboBus.Favorite.find({query:{identifier:'User',operator:'=',value:usuario.m_id}});
    	var result = false;
    	$.each(favorito,function(){
	    	if(this.get('Nombre')== name)
	    	{
	    		result = true;
	    		return false;
	    	}
    	});
    	return result;
    },
    
    controlSelected:function(id){
    	
    	var favoriteName = M.ViewManager.getView(id, 'items_result').value;
    	var favorite = _.detect(this.list_favorite, function(favorite) {
            return favorite.name === favoriteName;
        });
    	ArriboBus.SearchController.setList();
    	ArriboBus.SearchController.switchToResultBusPage();
    	ArriboBus.UserTabBarPage.setActiveTab(ArriboBus.UserTabBarPage.home);
    },
    /*
     * Funcion para verificar si el usuario est� logeado
     */
    checkIsLoged: function()
    {
    	if(!ArriboBus.LoginController.isLoged())
    	{
    		M.DialogView.confirm({
    		    title: 'Aviso!',
    		    message: 'Para acceder a tus Favoritos debes loguearte primero.',
    		    confirmButtonValue: 'Login',
    		    cancelButtonValue: 'Cancelar',
    		    callbacks: {
    		        confirm:{
    		        	target: ArriboBus.FavoriteController,
    		        	action:	'switchToLoginPage'
    		        },
    		        cancel: {
    		        	target: ArriboBus.FavoriteController,
    		            action: 'switchToTabHome'
    		        }
    		    }
    		});
    	}else{
    		var usuario = ArriboBus.LoginController.get('current_user');
    		var favorito = ArriboBus.Favorite.find({query:{identifier:'User',operator:'=',value:usuario.m_id}});
    		var that = this;
    		var array_favorite = [];
    		$.each(favorito,function(){
    		    	array_favorite.push({name: this.get('Nombre'),id:this.m_id});
    		});
			this.set('list_favorite',array_favorite);    		
    	}
    },
    
    back:function(){
    	this.switchToPage(ArriboBus.SearchBusPage);
    },
    
    switchToLoginPage: function() {
    	this.switchToPage(ArriboBus.LoginPage);
    },
    
    switchToTabHome: function() {
    	this.switchToTab(ArriboBus.UserTabBarPage.home);
    },
    
    switchToNewFavoritePage: function(){
    	this.switchToPage(ArriboBus.NewFavoritePage);
    	
    }

});

//==========================================================================
//The M-Project - Mobile HTML5 Application Framework
//Generated with: Espresso 

//Project: ArriboBus
//Controller: LoginController
//==========================================================================

ArriboBus.LoginController = M.Controller.extend({

	/* sample controller property */
	current_user: '',
	img_user:'',
	login_state:'',

	/*
	 * Sample function To handle the first load of a page.
	 */
	init: function(isFirstLoad) {
		if(isFirstLoad) {
			/* do something here, when page is loaded the first time. */
		}
		if(this.isLoged()){
			this.set('img_user','theme/images/user.png');
			this.set('login_state','Logout');
		}else{
			this.set('login_state','Login');
			this.set('img_user','');
		}
		
	},

	register: function(){
		var form = M.ViewManager.getView(ArriboBus.RegisterPage, 'frm_register');
		if(form.validate())
		{
			var data = form.getFormValues();
			if(data.password !== data.confirmacion)
			{
				M.DialogView.alert({
					title: 'Error',
					message: 'Password y Confirmacion de Password no son iguales.',
					confirmButtonValue: 'Cancelar',
					callbacks: {
						confirm: {
							action: function() {
								return false;
							}
						}
					}
				});
			}else{
				var confirm = ArriboBus.User.find({query:{identifier:'email',operator:'=',value:data.email}});
				if(confirm.length > 0)
				{
					M.DialogView.alert({
						title: 'Error',
						message: 'El E-mail ya se encuentra registrado.',
						confirmButtonValue: 'Cancelar',
						callbacks: {
							confirm: {
								action: function() {
									return false;
								}
							}
						}
					});
				}else{
					delete data.confirmacion;
					ArriboBus.User.createRecord(data).save();
					this.switchToHomePage();
				}
			}
		}
	},

	authenticate: function(){
		var form = M.ViewManager.getView(ArriboBus.LoginPage, 'frm_login');
		if(form.validate())
		{
			var data = form.getFormValues();    		
			var useremail = ArriboBus.User.find({query:{identifier:'email',operator:'=',value:data.email}});
			if(useremail.length > 0)
			{
				if(useremail[0].get('password') == data.password)
				{
					M.DialogView.alert({
						title: 'Bienvenido!',
						message: 'Bienvenido a Arribo Bus!.',
						confirmButtonValue: 'Cancelar',
						callbacks: {
							confirm: {
								action: function() {
									return false;
								}
							}
						}
					});
					this.set('current_user',useremail[0]);
					this.switchToTabHome();
				}
			}else{
				M.DialogView.alert({
					title: 'Error',
					message: 'Usuario y/o Password incorrentos!',
					confirmButtonValue: 'Cancelar',
					callbacks: {
						confirm: {
							action: function() {
								return false;
							}
						}
					}
				});
			}
		}
	},

	getPerfil: function(){
		if(!this.isLoged())
		{
			M.DialogView.confirm({
				title: 'Aviso!',
				message: 'Para acceder a tu Perfil debes loguearte primero.',
				confirmButtonValue: 'Login',
				cancelButtonValue: 'Cancelar',
				callbacks: {
					confirm:{
    		        	target: ArriboBus.FavoriteController,
    		        	action:	'switchToLoginPage'
    		        },
    		        cancel: {
    		        	target: ArriboBus.FavoriteController,
    		            action: 'switchToTabHome'
    		        }
				}
			});
		}
	},

	/*
	 * Funcion que devuelve el estado de logeo
	 */
	isLoged: function(){
		if(this.get('current_user') != '')
		{
			return true;
		}else{
			return false;
		}
	},

	switchToLoginPage: function() {
		if(this.get('login_state')=='Login')
		{
			this.switchToPage(ArriboBus.LoginPage);
		}else{
			this.set('current_user','');
			this.set('img_user','');
			this.set('login_state','Login');
			this.switchToHomePage();
		}
	},

	switchToRegisterPage: function(){
		this.switchToPage(ArriboBus.RegisterPage,M.TRANSITION.POP);
	},

	switchToHomePage: function(){
		this.switchToPage(ArriboBus.HomePage,M.TRANSITION.FLIP);
	},
	
    switchToTabPerfil: function() {
    	this.switchToTab(ArriboBus.UserTabBarPage.perfil);
    },
    
    switchToTabHome: function() {
    	this.switchToTab(ArriboBus.UserTabBarPage.home);
    }
});

// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ArriboBus
// Controller: SearchController
// ==========================================================================

ArriboBus.SearchController = M.Controller.extend({

    /* sample controller property */
    current_ramal: '',
    current_sentido:'',
    current_linea:'',
    current_parada:'',
    current_tiempo:'',
    list_search:new Array(),
    list_paradas:new Array(),

    /*
    * Sample function
    * To handle the first load of a page.
    */
    init: function(isFirstLoad) {
        if(isFirstLoad) {
        	
        }
    },
    
    getLastSerach: function(){
    	var data = '';
    	data = this.get('current_linea')+'-';
    	data = data + this.get('current_ramal')+'-';
    	data = data + this.get('current_parada')+'-';
    	data = data + this.get('current_sentido')+'-';
    	return data;
    },
    
    /*
     * Funcion para desplegar el Dialog de Lineas
     */
    getDialogLinea: function()
    {
    	M.DialogView.actionSheet({
    	    title: 'Seleccione una Linea',
    	    cancelButtonValue: 'Cancelar',
    	    otherButtonValues: ['Linea 130','Ramal 70'],
    	    otherButtonTags: ['linea130','linea70'],
    	    callbacks:{
    	    	other:{
    	    		action:function(){
    	    			ArriboBus.SearchController.set('current_linea','Linea 130');
    	    			ArriboBus.SearchController.switchToPage(ArriboBus.SeachPass2Page);
    	    		}
    	    	 }
    	    }
    	});
    },
    
    
    /*
     * Funcion para desplegar el Dialog de Ramales
     */
    getDialogRamal: function()
    {
       if(this.get('current_linea') != '')
       {
    	M.DialogView.actionSheet({
    	    title: 'Seleccione un Ramal',
    	    cancelButtonValue: 'Cancelar',
    	    otherButtonValues: ['Ramal 1','Ramal 2','Ramal 3','Ramal 4'],
    	    otherButtonTags: ['ramal1','ramal2','ramal3','ramal4'],
    	    callbacks:{
    	    	other:{
    	    		action:function(){
    	    			ArriboBus.SearchController.set('current_ramal','Ramal 1');
    	    			ArriboBus.SearchController.switchToPage(ArriboBus.SeachPass3Page);
    	    		}
    	    	 }
    	    }
    	});
       }else{
    	   M.DialogView.alert({
    		    title: 'Requerido',
    		    message: 'Debe de seleccionar una Linea.'
    	   });
       }
    },
    /*
     * Funcion para desplegar el Dialog de Sentido
     */
    getDialogSentido:function()
    {
    	if(this.get('current_linea')!= '' && this.current_ramal !='' && this.current_parada !='')
    	{
    		M.DialogView.actionSheet({
    			title: 'Seleccione un Sentido',
    			cancelButtonValue: 'Cancelar',
    			otherButtonValues: ['Ida','Vuelta'],
    			otherButtonTags: ['ida','vuelta'],
    			callbacks:{
    				other:{
    					action:function(){
    						ArriboBus.SearchController.set('current_sentido','Ida');
    						ArriboBus.SearchController.switchToPage(ArriboBus.SeachPass5Page);
    						}
    				}
    			}
    		});
    	}else{
    		M.DialogView.alert({
    			title: 'Requerido',
    			message: 'Debe de seleccionar una Linea, un Ramal y una Parada.'
    		});
    	}
    },
    
    /*
     * Funcion para realizar la busqueda del usuario
     */
    search: function(){
    	var form = M.ViewManager.getView(ArriboBus.SearchBusPage, 'frm_search');
    	if(form.validate())
    	{
    		this.setList();
        	this.switchToResultBusPage();
        	form.clearForm();
    	}
    },
    
    /**
     * Funcion para obtener las paradas
     */
    getParadas:function()
    {
    	this.setListParadas();
    },
    
    /**
     * Seteamos la lista de Paradas
     */
    setListParadas:function()
    {
    	var list=[{parada: "Av. Regimiento de Patricios y La Madrid"},
		          {parada: "Av. Regimiento de Patricios y Suarez"},
		          {parada: "Av. Regimiento de Patricios y Almte. Brown"},
		          {parada: "Av. Regimiento de Patricios y No se que"}];
		this.set('list_paradas',list);
    },
    
    /**
     * Funcion para setear la parada seleccionada
     */
    setParada: function(id)
    {
    	var parada = M.ViewManager.getView(id, 'items_result').value;
        this.set('current_parada',parada);
        //this.switchToSearchPage();
        this.switchToPage(ArriboBus.SeachPass4Page);
        
    },
    
    /**
     * Seteamos la lista de Resultados
     */
    setList: function(){
		var list=[{movil: "",value: "2 min."},
		          {movil: "",value: "10 min."},
		          {movil: "",value: "15 min."},
		          {movil: "",value: "30 min."}];
		this.set('list_search',list);
    },
    
    /*
     * Funcion para ver la Pagina de Busqueda
     */
    switchToSearchPage: function() {
        //this.switchToPage(ArriboBus.SearchBusPage);
    	this.switchToPage(ArriboBus.SeachPass1Page);
    },
    
    switchToResultBusPage: function(){
    	this.switchToPage(ArriboBus.ResultBusPage);
    },
    
    switchToParadaPage: function(){
    	if(this.get('current_linea')!= '' && this.current_ramal !='')
    	{
    		this.switchToPage(ArriboBus.ParadaPage,M.TRANSITION.FLIP,YES,NO);
    	}else{
    		M.DialogView.alert({
    			title: 'Requerido',
    			message: 'Debe de seleccionar una Linea y un Ramal.'
    		});
    	}
    }

});

// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ArriboBus
// View: HeaderPage
// ==========================================================================

ArriboBus.HeaderPage = M.ToolbarView.design({
	childViews:'user_info lbl_home btn_login',
    anchorLocation: M.TOP,
    
    user_info:M.ScrollView.design({
    	childViews:'img_user lbl_user',
    	cssClass:'user_info',
		anchorLocation: M.LEFT,
    	img_user:M.ImageView.design({
    			contentBinding: {
    				target: ArriboBus.LoginController,
    				property: 'img_user'
    			},
    		    events: {
    	            tap: {
    	            	target: ArriboBus.LoginController,
    	            	action:'switchToTabPerfil'
    	            }
    	        }
    	   }),
    	 lbl_user:M.LabelView.design({
    		 	isInline: YES,
    		 	value:'',
    		    contentBinding: {
    		        target: ArriboBus.LoginController,
    		        property: 'current_user.record.nombre'
    		    }
    	})
    }),
    
    lbl_home: M.LabelView.design({
        anchorLocation: M.CENTER,
        value: 'Arribo Bus'
    }),
    
    btn_login: M.ButtonView.design({
        value: '',
	    contentBinding: {
	        target: ArriboBus.LoginController,
	        property: 'login_state'
	    },
        anchorLocation: M.RIGHT,
        icon: 'check',
        events: {
            tap: {
            	target: ArriboBus.LoginController,
            	action:'switchToLoginPage'
            }
        }
    })
});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ArriboBus
// View: Parada_Items_Template
// ==========================================================================

ArriboBus.Parada_Items_Template = M.ListItemView.design({

	childViews: 'items_result',
	isSelectable: YES,
    events: {
        tap: {
            target: ArriboBus.SearchController,
            action:'setParada'
        }
    },

	items_result: M.LabelView.design({

        valuePattern: '<%= parada %>'

    })

});



// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ArriboBus
// View: ParadaPage
// ==========================================================================
m_require('app/views/Parada_Items_Template.js');
ArriboBus.ParadaPage = M.PageView.design({

    /* Use the 'events' property to bind events like 'pageshow' */
    events: {
        pageshow: {
            target: ArriboBus.SearchController,
            action: 'getParadas'
        }
    },
    
    cssClass: 'ParadaPage',

    childViews: 'header content',

    header: M.ToolbarView.design({
        value: 'Buscar Parada',
        anchorLocation: M.TOP
    }),

    content: M.ScrollView.design({
    	childViews: 'lst_result_parada',
    	
    	lst_result_parada: M.ListView.design({
  		  listItemTemplateView: ArriboBus.Parada_Items_Template,
  		  hasSearchBar: YES,
		  contentBinding: {
					target: ArriboBus.SearchController,
					property: 'list_paradas'
						},
		  idName: 'items_result'
          })
    })
});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ArriboBus
// View: RegisterPage
// ==========================================================================

ArriboBus.RegisterPage = M.PageView.design({
    
    cssClass: 'RegisterPage',

    childViews: 'header content',
    
    events: {
    	pagebeforeshow: {
            target: ArriboBus.LoginController,
            action: 'init'
        }
    },
    
    
    header: M.ToolbarView.design({
    	childViews:'lbl_register btn_home',
        anchorLocation: M.TOP,
        lbl_register: M.LabelView.design({
            anchorLocation: M.CENTER,
            value: 'Registro'
        }),
        
        btn_home: M.ButtonView.design({
            anchorLocation: M.LEFT,
            value:'Inicio',
            icon: 'home',
            //isIconOnly: YES,
            events: {
                tap: {
                	target: ArriboBus.LoginController,
                	action:'switchToHomePage'
                }
            }
        })
    }),

    content: M.ScrollView.design({
        childViews: 'frm_register',
        
        frm_register: M.FormView.design({
        	showAlertDialogOnError: YES,
        	alertTitle:'Error(s)',
        	childViews:'email password confirmacion nombre apellido submit',
        	
        	email:M.TextFieldView.design({
        		initialText:'example@hotmail.com',
        		label:'E-mail ID',
        		hasAsteriskOnLabel: YES,
        		validators: [M.PresenceValidator, M.EmailValidator]
        	}),
        	
        	password:M.TextFieldView.design({
        		label:'Password',
        		hasAsteriskOnLabel: YES,
        		inputType:M.INPUT_PASSWORD,
        		validators: [M.PresenceValidator]
        	}),
        	
        	confirmacion:M.TextFieldView.design({
        		label:'Repita Password',
        		hasAsteriskOnLabel: YES,
        		inputType:M.INPUT_PASSWORD
        	}),
        	
        	nombre:M.TextFieldView.design({
        		label:'Nombre',
        		hasAsteriskOnLabel: YES,
        		validators: [M.PresenceValidator]
        	}),
        	
        	apellido:M.TextFieldView.design({
        		label:'Apellido',
        		hasAsteriskOnLabel: YES,
        		validators: [M.PresenceValidator]
        	}),
        	
        	submit:M.ButtonView.design({
        		value:'Ingresar',
        		icon:'check',
        		events: {
        	        tap: {
        	        	target: ArriboBus.LoginController,
        	            action: 'register'
        	        }
        	    }
        	})
        	
        })
    })
});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ArriboBus
// View: ResultBus_Items_Template
// ==========================================================================

ArriboBus.ResultBus_Items_Template = M.ListItemView.design({

	childViews: 'items_result',
	 isSelectable: NO,
    /*events: {
        tap: {
            target: ArriboBus.LoginController,
            action:'controlSelected'
        }
    },*/

	items_result: M.LabelView.design({

        valuePattern: '<%= movil %> llega en <%= value %> aprox.'

    })

});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ArriboBus
// View: SeachPass1Page
// ==========================================================================

ArriboBus.SeachPass1Page = M.PageView.design({
    
    cssClass: 'SeachPass1Page',

    childViews: 'header content',

    header: M.ToolbarView.design({
        value: 'Paso Uno',
        anchorLocation: M.TOP,
        showBackButton: YES
    }),

    content: M.ScrollView.design({
    	childViews:'linea btn_select_linea',
		
		linea:M.TextFieldView.design({
			label:'Linea',
			hasAsteriskOnLabel: YES,
			isGrouped: YES,
			isEnabled: NO,
    		contentBinding: {
    	        target: ArriboBus.SearchController,
    	        property: 'current_linea'
    	    },
    	    validators: [M.PresenceValidator]
    	}),
    	
    	btn_select_linea:M.ButtonView.design({
    		value:'Seleccionar Linea',
            events: {
                tap: {
                	target: ArriboBus.SearchController,
                	action:'getDialogLinea'
                }
            }
        })
    })
});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ArriboBus
// View: SeachPass3Page
// ==========================================================================

ArriboBus.SeachPass3Page = M.PageView.design({

    cssClass: 'SeachPass3Page',

    childViews: 'header content',

    header: M.ToolbarView.design({
        value: 'Paso 3',
        anchorLocation: M.TOP,
        showBackButton: YES
    }),

    content: M.ScrollView.design({
    	childViews:'parada btn_select_parada',
		
		parada:M.TextFieldView.design({
			label:'Parada',
			hasAsteriskOnLabel: YES,
			isGrouped: YES,
			isEnabled: NO,
    		contentBinding: {
    	        target: ArriboBus.SearchController,
    	        property: 'current_parada'
    	    },
    	    validators: [M.PresenceValidator]
    	}),
    	
    	btn_select_parada:M.ButtonView.design({
    		value:'Buscar Parada',
            events: {
                tap: {
                	target: ArriboBus.SearchController,
                	action:'switchToParadaPage'
                }
            }
        })
    })

});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ArriboBus
// View: SeachPass4Page
// ==========================================================================

ArriboBus.SeachPass4Page = M.PageView.design({
    
    cssClass: 'SeachPass4Page',

    childViews: 'header content',

    header: M.ToolbarView.design({
        value: 'Paso 4',
        anchorLocation: M.TOP,
        showBackButton: YES
    }),

    content: M.ScrollView.design({
    	childViews:'sentido btn_select_sentido',

		sentido:M.TextFieldView.design({
			label:'Sentido',
			hasAsteriskOnLabel: YES,
			isGrouped: YES,
			isEnabled: NO,
    		contentBinding: {
    	        target: ArriboBus.SearchController,
    	        property: 'current_sentido'
    	    },
    	    validators: [M.PresenceValidator]
    	}),
    	
		btn_select_sentido:M.ButtonView.design({
    		value:'Seleccionar Sentido',
            events: {
                tap: {
                	target: ArriboBus.SearchController,
                	action:'getDialogSentido'
                }
            }
        })
    })
});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ArriboBus
// View: SeachPass5Page
// ==========================================================================

ArriboBus.SeachPass5Page = M.PageView.design({

    cssClass: 'SeachPass5Page',

    childViews: 'header content',

    header: M.ToolbarView.design({
        value: 'Paso 5',
        anchorLocation: M.TOP,
        showBackButton: YES
    }),

    content: M.ScrollView.design({
    	childViews:'lst_select_min btn_submit',
    	
    	lst_select_min:M.SelectionListView.design({

            childViews: 'item1 item2 item3',
            selectionMode: M.SINGLE_SELECTION_DIALOG,
            label:'Tiempo de Llegada',
            isGrouped: YES,
            
            item1: M.SelectionListItemView.design({
                value: '10',
                label: 'Menos de 10 min.',
                isSelected: YES
            }),
            item2: M.SelectionListItemView.design({
                value: '15',
                label: 'Menos de 15 min.'
            }),
            item3: M.SelectionListItemView.design({
                value: '30',
                label: 'Menos de 30 min'
            })
        }),
    	
        btn_submit:M.ButtonView.design({
    		value:'Consultar',
    		icon:'search',
            events: {
                tap: {
                	target: ArriboBus.SearchController,
                	action:'search'
                }
            }
        })
    })

});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ArriboBus
// View: UserTabBarPage
// ==========================================================================

ArriboBus.UserTabBarPage = M.TabBarView.design({
    childViews: 'home favorite perfil',
    anchorLocation: M.CENTER,
    
    home:M.TabBarItemView.design({
        value: 'Arribo Bus',
        page: 'HomePage',
        icon: 'home'
    }),
    favorite: M.TabBarItemView.design({
        value: 'Favoritos',
        page: 'FavoritePage',
        icon: 'star'
    }),
    perfil: M.TabBarItemView.design({
        value: 'Perfil',
        page: 'PerfilPage',
        icon: 'gear'
    })

});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ArriboBus
// View: HomePage
// ==========================================================================
m_require('app/views/UserTabBarPage.js');
m_require('app/views/HeaderPage.js');
ArriboBus.HomePage = M.PageView.design({
   
	events: {
        pageshow: {
            target: ArriboBus.LoginController,
            action: 'init'
        }
    },
	
    cssClass: 'HomePage',

    childViews: 'header content footer',

    header: ArriboBus.HeaderPage,

    content: M.ScrollView.design({
        childViews: 'img_home btn_consultar',
        
        img_home:M.ImageView.design({
        	cssClass:'img_home',
            value: 'theme/images/Bus-403.png'
        }),
        
        btn_consultar: M.ButtonView.design({
            value: 'Arribos',
            events: {
                tap: {
                	target: ArriboBus.SearchController,
                	action:'switchToSearchPage'
                }
            }
        })
    }),

    footer: M.ToolbarView.design({
    	childViews:'user_tab_bar',
        anchorLocation: M.BOTTOM,
        isFixed: YES,        
        user_tab_bar: ArriboBus.UserTabBarPage
    })

});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ArriboBus
// View: FavoritePage
// ==========================================================================
m_require('app/views/UserTabBarPage.js');
ArriboBus.FavoritePage = M.PageView.design({

    /* Use the 'events' property to bind events like 'pageshow' */
    events: {
    	pagebeforeshow: {
            target: ArriboBus.FavoriteController,
            action: 'checkIsLoged'
        }
    },
    
    cssClass: 'FavoritePage',

    childViews: 'header content footer',

    header: M.ToolbarView.design({
        value: 'Mis Arribos',
        anchorLocation: M.TOP
    }),

    content: M.ScrollView.design({
    	childViews: 'lst_result_favorite',
    	
    	lst_result_favorite: M.ListView.design({
  		  listItemTemplateView: ArriboBus.Favorite_Items_Template,
  		  hasSearchBar: YES,
		  contentBinding: {
					target: ArriboBus.FavoriteController,
					property: 'list_favorite'
						},
		  idName: 'items_result'
          })
    }),

    footer: M.ToolbarView.design({
    	childViews:'user_tab_bar',
        anchorLocation: M.BOTTOM,
        user_tab_bar: ArriboBus.UserTabBarPage
    })

});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ArriboBus
// View: LoginPage
// ==========================================================================
m_require('app/views/UserTabBarPage.js');
ArriboBus.LoginPage = M.PageView.design({

    /* Use the 'events' property to bind events like 'pageshow' */
    events: {
        pageshow: {
            target: ArriboBus.LoginController,
            action: 'init'
        }
    },
    
    cssClass: 'LoginPage',

    childViews: 'header content footer',

    header: M.ToolbarView.design({
        value: 'Login',
        anchorLocation: M.TOP,
        showBackButton: YES
    }),

    content: M.ScrollView.design({
        childViews: 'frm_login btn_registro',
        
        frm_login: M.FormView.design({
        	showAlertDialogOnError: YES,
        	alertTitle:'Error(s)',
        	childViews:'email password recordarme submit',
        	
        	email:M.TextFieldView.design({
        		initialText:'example@hotmail.com',
        		label:'E-mail ID',
        		isGrouped: YES,
        		hasAsteriskOnLabel: YES,
        		validators: [M.PresenceValidator, M.EmailValidator]
        	}),
        	
        	password:M.TextFieldView.design({
        		label:'Password',
        		isGrouped: YES,
        		hasAsteriskOnLabel: YES,
        		inputType:M.INPUT_PASSWORD,
        		validators: [M.PresenceValidator]
        	}),
        	
        	recordarme:M.SelectionListView.design({

                childViews: 'item1 item2',
                selectionMode: M.SINGLE_SELECTION_DIALOG,
                label:'Recordarme',
                isGrouped: YES,
                
                item1: M.SelectionListItemView.design({
                    value: '0',
                    label: 'SI',
                    isSelected: YES
                }),
                item2: M.SelectionListItemView.design({
                    value: '1',
                    label: 'NO'
                })
            }),
        	
        	submit:M.ButtonView.design({
        		value:'Ingresar',
        		icon:'check',
        		events: {
        	        tap: {
        	        	target: ArriboBus.LoginController,
        	            action: 'authenticate'
        	        }
        	    }
        	})
        	
        }),
        
        /*btn_autologin:M.ButtonView.design({
    		value:'Autologin',
    		icon:'check',
    		events: {
    	        tap: {
    	        	target: ArriboBus.LoginController,
    	            action: 'switchToRegisterPage'
    	        }
    	    }
    	}),*/
        
        
        btn_registro:M.ButtonView.design({
    		value:'Registrarse',
    		icon:'add',
    		events: {
    	        tap: {
    	        	target: ArriboBus.LoginController,
    	            action: 'switchToRegisterPage'
    	        }
    	    }
    	})
    }),

    footer: M.ToolbarView.design({
    	childViews:'user_tab_bar',
        anchorLocation: M.BOTTOM,
        //isFixed: YES,
        user_tab_bar: ArriboBus.UserTabBarPage
    })

});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ArriboBus
// View: NewFavoritePage
// ==========================================================================
m_require('app/views/UserTabBarPage.js');
ArriboBus.NewFavoritePage = M.PageView.design({

    /* Use the 'events' property to bind events like 'pageshow' */
    events: {
        pageshow: {
            target: ArriboBus.FavoriteController,
            action: 'getLastSearch'
        }
    },
    
    cssClass: 'NewFavoritePage',

    childViews: 'header content footer',

    header: M.ToolbarView.design({
        value: 'Nuevo Favorito',
        anchorLocation: M.TOP
    }),

    content:M.ScrollView.design({
        childViews: 'frm_favorite',
        
        frm_favorite: M.FormView.design({
        	childViews:'content_favorite content_linea content_ramal content_parada content_sentido content_min content_submit',
        	
        	content_favorite:M.ContainerView.design({
        		childViews:'Nombre',
        		
        		Nombre:M.TextFieldView.design({
        			label:'Nombre',
        			isGrouped: YES,
        			isEnabled: YES,
            	    validators: [M.PresenceValidator]
            	})
        	}),     
        	
        	content_linea:M.ContainerView.design({
        		childViews:'Linea',
        		
        		Linea:M.TextFieldView.design({
        			label:'Linea',
        			isGrouped: YES,
        			isEnabled: NO,
            		contentBinding: {
            	        target: ArriboBus.SearchController,
            	        property: 'current_linea'
            	    },
            	    validators: [M.PresenceValidator]
            	})
        	}),        	
        	
        	content_ramal:M.ContainerView.design({
        		childViews:'Ramal',
        		
        		Ramal:M.TextFieldView.design({
        			label:'Ramal',
        			isGrouped: YES,
        			isEnabled: NO,
            		contentBinding: {
            	        target: ArriboBus.SearchController,
            	        property: 'current_ramal'
            	    },
            	    validators: [M.PresenceValidator]
            	})
        	}),
        	
        	content_parada:M.ContainerView.design({
        		childViews:'Parada',
        		
        		Parada:M.TextFieldView.design({
        			label:'Parada',
        			isGrouped: YES,
        			isEnabled: NO,
            		contentBinding: {
            	        target: ArriboBus.SearchController,
            	        property: 'current_parada'
            	    },
            	    validators: [M.PresenceValidator]
            	})
        	}),

        	content_sentido:M.ContainerView.design({
        		childViews:'Sentido',
        		isGrouped: YES,
        		
        		Sentido:M.TextFieldView.design({
        			label:'Sentido',
        			isGrouped: YES,
        			isEnabled: NO,
            		contentBinding: {
            	        target: ArriboBus.SearchController,
            	        property: 'current_sentido'
            	    },
            	    validators: [M.PresenceValidator]
            	})
        	}),
                        
            content_min:M.ContainerView.design({
            	childViews:'Tiempo',
            	
            	Tiempo:M.TextFieldView.design({
        			label:'Tiempo',
        			isGrouped: YES,
        			isEnabled: NO,
            		contentBinding: {
            	        target: ArriboBus.SearchController,
            	        property: 'current_tiempo'
            	    }
            	})
            }),
            
            content_submit:M.ContainerView.design({
            	childViews:'btn_submit',
            	
                btn_submit:M.ButtonView.design({
            		value:'Agregar',
            		icon:'add',
                    events: {
                        tap: {
                        	target: ArriboBus.FavoriteController,
                        	action:'add'
                        }
                    }
                })
            })
        })
    }),

    footer: M.ToolbarView.design({
    	childViews:'user_tab_bar',
        anchorLocation: M.BOTTOM,
        
        user_tab_bar: ArriboBus.UserTabBarPage
    })

});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ArriboBus
// View: PerfilPage
// ==========================================================================
m_require('app/views/UserTabBarPage.js');
ArriboBus.PerfilPage = M.PageView.design({

    /* Use the 'events' property to bind events like 'pageshow' */
    events: {
        pageshow: {
            target: ArriboBus.LoginController,
            action: 'getPerfil'
        }
    },
    
    cssClass: 'PerfilPage',

    childViews: 'header content footer',

    header: M.ToolbarView.design({
        value: 'Perfil',
        anchorLocation: M.TOP
    }),

    content: M.ScrollView.design({
        childViews: 'frm_perfil_info',
        
        frm_perfil_info: M.FormView.design({
        	showAlertDialogOnError: YES,
        	alertTitle:'Error(s)',
        	childViews:'email nombre apellido submit',
        	
        	email:M.TextFieldView.design({
        		label:'E-mail ID',
    			isGrouped: YES,
    			isEnabled: NO,
                contentBinding: {
                    target: ArriboBus.LoginController,
                    property: 'current_user.record.email'
                },
        		validators: [M.PresenceValidator, M.EmailValidator]
        	}),
        	
        	nombre:M.TextFieldView.design({
        		label:'Nombre',
        		hasAsteriskOnLabel: YES,
    			isGrouped: YES,
    			isEnabled: YES,
                contentBinding: {
                    target: ArriboBus.LoginController,
                    property: 'current_user.record.nombre'
                },
        		validators: [M.PresenceValidator]
        	}),
        	
        	apellido:M.TextFieldView.design({
        		label:'Apellido',
        		hasAsteriskOnLabel: YES,
    			isGrouped: YES,
    			isEnabled: YES,
                contentBinding: {
                    target: ArriboBus.LoginController,
                    property: 'current_user.record.apellido'
                },
        		validators: [M.PresenceValidator]
        	}),
        	
        	submit:M.ButtonView.design({
        		value:'Modificar',
        		icon:'add',
        		events: {
        	        tap: {
        	        	target: ArriboBus.LoginController,
        	            action: 'register'
        	        }
        	    }
        	})
        	
        })
    }),

    footer:M.ToolbarView.design({
    	childViews:'user_tab_bar',
        anchorLocation: M.BOTTOM,
        
        user_tab_bar: ArriboBus.UserTabBarPage
    })

});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ArriboBus
// View: ResultBusPage
// ==========================================================================
m_require('app/views/ResultBus_Items_Template.js');
m_require('app/views/UserTabBarPage.js');
ArriboBus.ResultBusPage = M.PageView.design({
    
    cssClass: 'ResultBusPage',

    childViews: 'header content footer',

    header: M.ToolbarView.design({
    	childViews:'lbl_result btn_add_favorite btn_back',
        showBackButton: YES,
        
        lbl_result:M.LabelView.design({
        	anchorLocation: M.CENTER,
            value: 'Resultado'
        }),
        
        btn_add_favorite:M.ButtonView.design({
        	anchorLocation: M.RIGHT,
    		value:'Favorito',
    		icon:'start',
    		events: {
    	        tap: {
    	        	target: ArriboBus.FavoriteController,
    	            action: 'switchToNewFavoritePage'
    	        }
    	    }
    	}),
    	
    	btn_back:M.ButtonView.design({
        	anchorLocation: M.LEFT,
    		value:'Back',
    		icon:'arrow-l',
    		events: {
    	        tap: {
    	        	target: ArriboBus.FavoriteController,
    	            action: 'back'
    	        }
    	    }
    	})
    }),

    content: M.ScrollView.design({
        childViews: 'lst_result_search',
        lst_result_search: M.ListView.design({
  		  listItemTemplateView: ArriboBus.ResultBus_Items_Template,
		  contentBinding: {
					target: ArriboBus.SearchController,
					property: 'list_search'
						},
		  idName: 'items_result'
          })
    }),

    footer: M.ToolbarView.design({
    	childViews:'user_tab_bar',
        anchorLocation: M.BOTTOM,
        user_tab_bar: ArriboBus.UserTabBarPage
    })

});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ArriboBus
// View: SearchBusPage
// ==========================================================================
m_require('app/views/UserTabBarPage.js');
ArriboBus.SearchBusPage = M.PageView.design({
	
    events: {
        pageshow: {
            target: ArriboBus.SearchController,
            action: 'init'
        }
    },
	
    cssClass: 'SearchBusPage',

    childViews: 'header content footer',
    
    header: M.ToolbarView.design({
        value: 'Buscar Arribos',
        anchorLocation: M.TOP,
        showBackButton: YES
    }),

    content: M.ScrollView.design({
        childViews: 'frm_search',
        
        frm_search: M.FormView.design({
        	childViews:'content_linea content_ramal content_parada content_sentido content_min content_submit',
        	//childViews:'txt_ramal btn_select_ramal btn_select_sentido sld_select_min btn_submit',
        	
        	content_linea:M.ContainerView.design({
        		childViews:'linea btn_select_linea',
        		
        		linea:M.TextFieldView.design({
        			label:'Linea',
        			hasAsteriskOnLabel: YES,
        			isGrouped: YES,
        			isEnabled: NO,
            		contentBinding: {
            	        target: ArriboBus.SearchController,
            	        property: 'current_linea'
            	    },
            	    validators: [M.PresenceValidator]
            	}),
            	
            	btn_select_linea:M.ButtonView.design({
            		value:'Seleccionar Linea',
                    events: {
                        tap: {
                        	target: ArriboBus.SearchController,
                        	action:'getDialogLinea'
                        }
                    }
                })
        	}),        	
        	
        	content_ramal:M.ContainerView.design({
        		childViews:'ramal btn_select_ramal',
        		
        		ramal:M.TextFieldView.design({
        			label:'Ramal',
        			isGrouped: YES,
        			isEnabled: NO,
        			hasAsteriskOnLabel: YES,
            		contentBinding: {
            	        target: ArriboBus.SearchController,
            	        property: 'current_ramal'
            	    },
            	    validators: [M.PresenceValidator]
            	}),
            	
            	btn_select_ramal:M.ButtonView.design({
            		value:'Seleccionar Ramal',
                    events: {
                        tap: {
                        	target: ArriboBus.SearchController,
                        	action:'getDialogRamal'
                        }
                    }
                })
        	}),
        	
        	content_parada:M.ContainerView.design({
        		childViews:'parada btn_select_parada',
        		
        		parada:M.TextFieldView.design({
        			label:'Parada',
        			hasAsteriskOnLabel: YES,
        			isGrouped: YES,
        			isEnabled: NO,
            		contentBinding: {
            	        target: ArriboBus.SearchController,
            	        property: 'current_parada'
            	    },
            	    validators: [M.PresenceValidator]
            	}),
            	
            	btn_select_parada:M.ButtonView.design({
            		value:'Buscar Parada',
                    events: {
                        tap: {
                        	target: ArriboBus.SearchController,
                        	action:'switchToParadaPage'
                        }
                    }
                })
        	}),

        	content_sentido:M.ContainerView.design({
        		childViews:'sentido btn_select_sentido',

        		sentido:M.TextFieldView.design({
        			label:'Sentido',
        			hasAsteriskOnLabel: YES,
        			isGrouped: YES,
        			isEnabled: NO,
            		contentBinding: {
            	        target: ArriboBus.SearchController,
            	        property: 'current_sentido'
            	    },
            	    validators: [M.PresenceValidator]
            	}),
            	
        		btn_select_sentido:M.ButtonView.design({
            		value:'Seleccionar Sentido',
                    events: {
                        tap: {
                        	target: ArriboBus.SearchController,
                        	action:'getDialogSentido'
                        }
                    }
                })
        	}),
                        
            content_min:M.ContainerView.design({
            	childViews:'lst_select_min',
            	
            	lst_select_min:M.SelectionListView.design({

                    childViews: 'item1 item2 item3',
                    selectionMode: M.SINGLE_SELECTION_DIALOG,
                    label:'Tiempo de Llegada',
                    isGrouped: YES,
                    
                    item1: M.SelectionListItemView.design({
                        value: '10',
                        label: 'Menos de 10 min.',
                        isSelected: YES
                    }),
                    item2: M.SelectionListItemView.design({
                        value: '15',
                        label: 'Menos de 15 min.'
                    }),
                    item3: M.SelectionListItemView.design({
                        value: '30',
                        label: 'Menos de 30 min'
                    })
                })
            }),
            
            content_submit:M.ContainerView.design({
            	childViews:'btn_submit',
            	
                btn_submit:M.ButtonView.design({
            		value:'Consultar',
            		icon:'search',
                    events: {
                        tap: {
                        	target: ArriboBus.SearchController,
                        	action:'search'
                        }
                    }
                })
            })
        })
    }),

    footer: M.ToolbarView.design({
    	childViews:'user_tab_bar',
        anchorLocation: M.BOTTOM,
        user_tab_bar: ArriboBus.UserTabBarPage
    })

});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ArriboBus
// View: ResultBus_Items_Template
// ==========================================================================

ArriboBus.Favorite_Items_Template = M.ListItemView.design({

	childViews: 'items_result',
    events: {
        tap: {
            target: ArriboBus.FavoriteController,
            action:'controlSelected'
        }
    },

	items_result: M.LabelView.design({

        valuePattern: '<%= name %>'

    })

});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ArriboBus
// View: SeachPass2Page
// ==========================================================================

ArriboBus.SeachPass2Page = M.PageView.design({
    
    cssClass: 'SeachPass2Page',

    childViews: 'header content',

    header: M.ToolbarView.design({
        value: 'Paso 2',
        anchorLocation: M.TOP,
        showBackButton: YES
    }),

    content: M.ScrollView.design({
    	childViews:'ramal btn_select_ramal',
		
		ramal:M.TextFieldView.design({
			label:'Ramal',
			isGrouped: YES,
			isEnabled: NO,
			hasAsteriskOnLabel: YES,
    		contentBinding: {
    	        target: ArriboBus.SearchController,
    	        property: 'current_ramal'
    	    },
    	    validators: [M.PresenceValidator]
    	}),
    	
    	btn_select_ramal:M.ButtonView.design({
    		value:'Seleccionar Ramal',
            events: {
                tap: {
                	target: ArriboBus.SearchController,
                	action:'getDialogRamal'
                }
            }
        })
    })
});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ArriboBus 
// ==========================================================================

var ArriboBus  = ArriboBus || {};

ArriboBus.app = M.Application.design({

    /* Define the entry/start page of your app. This property must be provided! */
    entryPage : 'HomePage',

    HomePage: ArriboBus.HomePage,
    
    FavoritePage: ArriboBus.FavoritePage,
    
    PerfilPage: ArriboBus.PerfilPage

});