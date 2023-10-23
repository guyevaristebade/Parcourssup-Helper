function makeServiceAjax(){
    /**
     * j'ai mis en place un service qui fait office de model pour faire des requêtes 
     * ce service propose aussi un cache local avec loc alstorage 
     */ 
    let state = {
        url : "https://data.enseignementsup-recherche.gouv.fr/api/records/1.0/search/?dataset=fr-esr-parcoursup&q=&sort=tri&facet=fili&facet=form_lib_voe_acc&facet=fil_lib_voe_acc&timezone=Europe%2FBerlin",//url de départ avec les facet qu'il faut pour récupérer les données"
            categorie  : {
                /**
                 * on initialise des catégories pour pouvoir raffiner les rêquettes au cours de la navigation dans le menu 
                 * */ 
                fili : null,
                form_voe : null,
                fil_voe : null,
                g_ea_lib_vx : null
            },
        pages : {
            chemin : ["", "", ""]
        },
        map : null

    }
   
    /**
     * Définis les fonction qui sont disponible pour ce service 
    */
	let service = {
        
        getFormation,
        getFiliereFormation,
        getFiliereFormationDetaille,
        ShareToOderComponent,
        getInfoEtablissement,
        setChemin,
        getChemin,
        initMap,
        refreshMap,
        setZoom
        
    }


    /**
     * récupère toute les formations  à partir de l'url de départ 
     * mise en place d'un cache pour les requêtes pour éviter les appels constant à l'api 
     * localstorage permet de mettre en cache les données
     * si le cache n'existe pas, on récupère les données depuis l'api
     * si le cache existe, on récupère les données depuis le cache
     * les données sont renvoyées au format JSON
     * */ 
    async function getFormation(){
        if(!localStorage.getItem("formations")){
            let data = await fetch((state.url))
            let reponse = await data.json()
            localStorage.setItem("formations",JSON.stringify(reponse))
            return reponse
        }else{
            return JSON.parse(localStorage.getItem("formations"))
        }
        
    }

    /**
     * à partir de l'url de départ, récupère les filières de formation 
     * */ 
    async function getFiliereFormation(fd){
        if(!localStorage.getItem("filiere de formation " + fd)){
            state.categorie.fili = encodeURIComponent(fd)
            let link = `${state.url}`+`&refine.fili=`+`${state.categorie.fili}`
            // state.url += "&refine.fili=" + state.categorie.fili
            console.log(link)
            let data = await fetch(link)
            let reponse = await data.json()
            localStorage.setItem("filiere de formation " + fd ,JSON.stringify(reponse))
            return reponse
        }else{
            return JSON.parse(localStorage.getItem("filiere de formation " + fd))
        }
    }

    /**
     * à partir de l'url précédent, récupère les filières de formation détaillée 
    */
    async function getFiliereFormationDetaille(ffd){
        if(!localStorage.getItem("filiere de formation detaille " + ffd)){
            state.categorie.form_voe = encodeURIComponent(ffd)
            let link = `${state.url}`+`&refine.fili=`+`${state.categorie.fili}&refine.form_lib_voe_acc=`+`${state.categorie.form_voe}`
            // state.url += "&refine.form_lib_voe_acc=" + state.categorie.form_voe
            console.log(link)
            let data = await fetch((link))
            let reponse = await data.json()
            localStorage.setItem("filiere de formation detaille " + ffd,JSON.stringify(reponse))
            return reponse
        }else{
            return JSON.parse(localStorage.getItem("filiere de formation detaille " + ffd))
        }
    }

    /**
     * à partir de l'url précédent il renvoie les données propres à une formations donnée
    */
    async function ShareToOderComponent(ffde){
        if(!localStorage.getItem("to order component " + ffde)){
            state.categorie.fil_voe = encodeURIComponent(ffde) 
            let link = `${state.url}` +`&refine.fili=`+`${state.categorie.fili}&refine.form_lib_voe_acc=`+`${state.categorie.form_voe}&refine.fil_lib_voe_acc=`+`${state.categorie.fil_voe}&rows=10000`
            let data = await fetch(link)
            let reponse = await data.json()
            localStorage.setItem("to order component " + ffde,JSON.stringify(reponse))
            return reponse
        }else{
            return JSON.parse(localStorage.getItem("to order component " + ffde))
        }
    }

    /**
     * renvoie les informations de l'établissement à partir de l'url précédent
    */
    async function getInfoEtablissement(etablissement){
        if(!localStorage.getItem("statistique " + etablissement)){
            state.categorie.g_ea_lib_vx = encodeURIComponent(etablissement)
            let link = `${state.url}`+`&refine.fili=`+`${state.categorie.fili}&refine.form_lib_voe_acc=`+`${state.categorie.form_voe}&refine.fil_lib_voe_acc=`+`${state.categorie.fil_voe}`+`&refine.g_ea_lib_vx=`+`${state.categorie.g_ea_lib_vx}`
            let data = await fetch((link))
            let reponse = await data.json()
            localStorage.setItem("statistique " + etablissement,JSON.stringify(reponse))
            return reponse
        }else{
            return JSON.parse(localStorage.getItem("statistique " + etablissement))
        }
    }

    /**
     * cette fonction est utilisée pour ajouter un chemin lorsqu'on clique sur un élément du menu
    */
    function setChemin(index,chemin){
        state.pages.chemin[index] = chemin
    }

    /**
     * cette fonction est utilisée pour récupérer un chemin et l'afficher lorsqu'on clique sur un élément du menu
    */ 
    function getChemin(){
        return state.pages.chemin
    }

    /**
     * initialisation de la carte avec les coordonnées de la france
    */
    function initMap(){
        state.map = L.map('map').setView([46.2276, 2.2137], 3)
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(state.map)
    }

    /**
     * permet de rafraichir la carte avec des nouveaux markers
    */
    function refreshMap(cible){
        state.map.eachLayer(layer =>{
            if(layer instanceof L.Marker){
                layer.remove()
            }
        })
        cible?.forEach(element => {
            let ville = element.fields.ville_etab
            let iut = element.fields.lib_comp_voe_ins
            let departement = element.fields.dep_lib
            let saut = "<br>"
            L.marker([element.geometry.coordinates[1],element.geometry.coordinates[0]]).addTo(state.map).bindPopup("<h1> Ville : "+ville+"</h1>" + saut+ "<h1> Nom : " + iut +"</h1> " + saut + "<h1> Département : " + departement + "<h1>")
        })
    }

    /**
     * permet de zoomer sur une zone lorsqu'on éffectue une rechererche 
     * prend une cible en paramètre
     * cible => est l'établissement à afficher dans la carte 
    */
    function setZoom(cible){
        if (cible.length > 0) {
            let coords = []
            cible.forEach(element => {
                coords.push([element.geometry.coordinates[1], element.geometry.coordinates[0]])
            })
            let bounds = L.latLngBounds(coords)
            state.map.fitBounds(bounds)
        }
    }

	return service
}

