

//----------------------------------------------------{DEFINITION DES VARIABLES GLOBALES}----------------------------------------------------

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>< Constantes physiques ><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

var c = 299792458; //Vitesse de la lumière.
var G = 6.67385 * Math.pow(10, -11); //Constante gravitationnelle. 

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>< Constantes pour les couleurs ><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

//Définition de couleurs en hexadécimal :
const COULEUR_ORANGE = '#ffb407';
const COULEUR_NOIR = '#2F2D2B';
const COULEUR_BLEU = '#4080A4';
const COULEUR_CYAN = '#008B8B';
const COULEUR_BLANC = '#ffffff';
const COULEUR_ROUGE = '#ff0000';
const COULEUR_ROUGE_COSMO= '#b54b3a';
const COULEUR_GRIS = '#CCCCCC';
const COULEUR_MARRON = '#673B15';
const COULEUR_BLEU_MARINE='#1A03FF'

//Association des couleurs à des éléments de la simulation : 
const COULEUR_PART = COULEUR_ROUGE_COSMO;
const COULEUR_RS = COULEUR_BLEU;
const COULEUR_RPHY = COULEUR_GRIS;

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>< Chemin des images pour l'explosion ><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

//Création des variables pour les images :
var expl1 =new Image();
var expl2 =new Image();
var expl3 =new Image();
var expl4 =new Image();
var expl5 =new Image();
var expl6 =new Image();

//Récupération des images : 
expl1.src='../Images/explose/expl1.png';
expl2.src='../Images/explose/expl2.png';
expl3.src='../Images/explose/expl3.png';
expl4.src='../Images/explose/expl4.png';
expl5.src='../Images/explose/expl5.png';
expl6.src='../Images/explose/expl6.png';

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>< Variables pour le zoom ><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

var nzoom=0 //Comptabilisation du zoom de manière générale.
var nz_avant_lancement=0; //Comptabilisation du zoom d'avant lancement. 

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>< Variables pour l'accélération/décélération ><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

var compteurVitesse = 0; //Comptabilisation de simu de manière générale.
var compteurVitesseAvantLancement =0; //Comptabilisation de simu avant lancement. 

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>< Variables pour le pilotage ><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

var pilotage_possible = true; //Pour savoir si on peut piloter ou non (si v=c par exemple on ne peut pas). 
var temps_acceleration; //Temps d'accélération ou décélération. 
var nombre_de_g_calcul_memo =0 //Dernier nombre de g ressenti.
var nombre_de_g_calcul=0; //g ressenti instantanné. 
var puissance_instant =0; //Puissance instantannée initialisée.
var puissance_instant_memo=0; //Puissance instantannée mémorisée.

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>< Boolean ><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

//Variables pour passer une seule fois dans des boucles : 
ifUneFois=true 
ifUneFois2=true
ifUneFois3=true 

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>< Initialisation de listes ><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

var rmaxjson = {}; //Liste contenant les coordonnées radiales maximales atteintes pour chaque mobile.
var mobilefactor = {}; //Liste contenant les facteurs d'échelle pour chaque mobile.
var r0o2 ={}; //Liste contenant les distances initiales au centre de l'astre pour chaque mobile. 
var listejsonfusees={}; //Liste regroupant l'initialisation de tous les compteurs. 
var optionsPotentiel = {}; //Liste pour stocker les id du menu choix du potentiel

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>< Autres variables ><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

var title = "V(r)/c² - 1"; //Stockage du titre du graphe de potentiel.
var nbRebonds = 0; //Pour compter le nombre de rebonds.
const DIAMETRE_PART = 1; //Pour fixer la taille du mobile.
var vtotal=0; //Initialisation de la vitesse physique.
var cle; //Variable utilisée pour repéré un indice de liste spécifique.
var fact_defaut; //Stockage du facteur d'échelle par défaut. 
var temps_observateur_distant=0 //Initialisation du temps d'observateur distant. 
var texte = o_recupereJson(); //Récupération du texte des json. 
var factGlobalAvecClef; //Facteur d'échelle du graphe qui peut être modifié avec le zoom.
var maximum; //Stockage de la distance initiale maximale parmi les mobiles.
var fuseecompteur; //Stockage du nombre de fusées générées.
var z_obs=0; //Stockage du décalage spectrale dans le référentiel de l'observateur.
var z=0; //Stockage du décalage spectrale dans le référentiel du mobile.



//-----------------------------------------------------------{TIMER}--------------------------------------------------
//Cette idée vient de StackOverflow par Nisse Engström
/*Ceci a ete fait pour remplacer setInterval car elle ne gere pas plusieurs mobiles, car 
elle n'appelle pas animate de maniére synchrone, car on appelle animate pour chaque mobile tout seul.
Par contre Timer est associé à chaque mobile et on peut appeler animate pour chaque mobile, sauf que 
cette fois on appelle setInterval pour faire fonctionner les Timer ensembles, et cela permet de 
synchroniser les calculs. (pas utilisée dans Kerr car 1 seul mobile à present) */
/**
 * Une classe pour creer des objets qui permettent de programmer l'appel de focntion.
 * @param funct : fonction pour laquelle on veut programmer l'appel.
 * @param compteur: indice pour savoir l'associer au mobile concerné par le Timer.
 * @param delayMs: le temps d'interval entre chaque appel en milisecondes.
 * @param times : combien de fois on veut l'appeler, on met -1 pour l'appeler indefiniment.
 */
class Timer 
{
	//on met le constructeur avec tout les atributs
    constructor(funct,compteur,delayMs, times) 
	{
        if (times === undefined) times = -1; // Définit le nombre de répétitions à -1 si non fourni (appel indéfini)
        if (delayMs === undefined) delayMs = 10; // Définit le délai à 10 ms si non fourni
		
        this.funct = funct; //la focntion
        this.times = times; //le nombre d'appels
        this.timesCount = 0; // Compteur d'appels effectués
        this.ticks = (delayMs / 10) | 0;  // Nombre de ticks avant chaque appel
        this.count = 0; // Compteur de ticks écoulés
		this.compteur=compteur // Identifiant pour l'instance de Timer (pour le relié à un mobile)
        Timer.instances[this.compteur]=this; // Enregistre l'instance dans le tableau des instances
    }
 	// Méthode appelée à chaque tick
    tick()
	{
        if (this.count >= this.ticks) // Vérifie si le nombre de ticks requis est atteint
		{
            this.funct();// Appelle la fonction
            this.count = 0;// Réinitialise le compteur de ticks
			
			/*Ceci concerne le cas où le Timer doit s'arreter à un temps donné */
            if (this.times > -1) // Si le nombre de répétitions est défini (non infini)
			{
                this.timesCount++;// Incrémente le compteur d'appels
                if (this.timesCount >= this.times) // Si le nombre d'appels atteint le maximum défini
				{
                    this.stop();// Arrête le timer
                }
            }
        }
        this.count++; // Incrémente le compteur de ticks
    }

    // Méthode pour arrêter le Timer
	stop() 
	{
        delete Timer.instances[this.compteur]; // Supprime l'instance du tableau des instances
	}
}
// Tableau associatif pour stocker les instances de Timer
Timer.instances = {};
// Indicateur pour savoir si tous les timers sont en pause
Timer.paused = false;

// Fonction appelée à chaque tick global
Timer.ontick = function () 
{
    if (!Timer.paused) // Vérifie si les timers ne sont pas en pause
	{
        for (const instance of Object.values(Timer.instances))  // On parcourt toutes instances de Timer
		{
            instance.tick();// Appelle la méthode tick
        }
    }
};

// Déclenche la fonction ontick toutes les millisecondes
window.setInterval(Timer.ontick, 1);


//----------------------------------------------------{initialisationGenerale}----------------------------------------------------

/**
 * Fonction qui permet l'initialisation de toutes les fusées. 
 * @param {Number} fuseecompteur : nombre de fusées générées.
 */
function initialisationGenerale(fuseecompteur){
	for (compteur = 1; compteur <= fuseecompteur; compteur += 1) {
	    listejsonfusees[compteur]=initialisation(compteur);  
	}
}

//----------------------------------------------------{lancerDeFusees}----------------------------------------------------
/**
 * Fonction qui permet de lancer la simulation pour tout les mobiles.
 * @param {*} fuseecompteur : nombre de fusées générées.
 */
function lancerDeFusees(fuseecompteur)
{
   		  
	M = Number(document.getElementById("M").value);//on recupere la masse
	r_phy = Number(document.getElementById("r_phy").value);//on recupere le rayon physique
	//on calcul le rayon de Schwarzschild 
	m = G * M / Math.pow(c, 2); 
	rs=2*m;
	//on fait une boucle sur tout les mobiles
	for (compteur = 1; compteur <= fuseecompteur; compteur += 1) 
	{
		trajectoire(compteur,listejsonfusees[compteur]); //on appelle trajectoire avec le mobile comme argument
	}

	/*C'est mieux de les mettre là que dans trejectoire ou autre car on veut que 
	ça soit global et pas relié à un mobile comme ça on pause quand on veut et pareil pour les touches du clavier */

	//si le bouton pause est cliqué on appelle la fonction pause
	document.getElementById("pause/resume").addEventListener("click", function() {
        pausee()});

 	//si le bouton pause en bas est cliqué en appelle la fonction pause 
	 document.getElementById('bouton_pause').addEventListener('click', function() {
		pausee();
	});

	//Permet une fois démarrée de gérer la simulation avec les touches du clavier.
	clavierEvenement(true); 

}

//supprHtml et genereHtml sont les fonctions qui generent le html de maniere dynamique
//----------------------------------------------------{supprHtml}----------------------------------------------------
/**
 * Cette fonction s'occupe de la suppression des elements  HTML generés
 */
function supprHtml(){

	//on recupere le nombre de fusées rentré par l'utilisateur
	var nbrfuseesuppr = sessionStorage.getItem("nombredefusees");
	//on eleve les tableaux créés
	document.getElementById('tableau-sortie').innerHTML = ''; 
	document.getElementById('tableau-sortie-2').innerHTML = ''; 
	document.getElementById('tableauresultatsimu').innerHTML = ''; 



	for (count = 1; count <= nbrfuseesuppr; count += 1) 
	{
		//on supprime le label du mobile
		var elementlabelasuppr = document.getElementById("label"+count.toString()+"");
		elementlabelasuppr.parentNode.removeChild(elementlabelasuppr);
		//on supprime le div qui contient les entrées
		var elementrayonasuppr = document.getElementById("divmobile"+count.toString()+"");
		elementrayonasuppr.parentNode.removeChild(elementrayonasuppr);

		//on supprime les graphes potentiel créés
		var elementgrapheasuppr = document.getElementById("grsvg_"+count.toString()+"");
		elementgrapheasuppr.parentNode.removeChild(elementgrapheasuppr);	
		//on supprime les options pour le potentiel
		var elementoptionasuppr = document.getElementById(texte.pages_trajectoire.potentiel_option+" "+count.toString());
		elementoptionasuppr.parentNode.removeChild(elementoptionasuppr);	

		//On supprime les canva créés pour les mobiles
		var elementcanvasbouleasuppr = document.getElementById("myCanvasBoule"+count.toString()+"");
		elementcanvasbouleasuppr.parentNode.removeChild(elementcanvasbouleasuppr);

	}

	//On supprime les canva créés
	var elementcanvasasuppr = document.getElementById("myCanvas");
	elementcanvasasuppr.parentNode.removeChild(elementcanvasasuppr);

	var elementcanvas3asuppr = document.getElementById("myCanvas3three");
	elementcanvas3asuppr.parentNode.removeChild(elementcanvas3asuppr);

}


//----------------------------------------------------{genereHtml}----------------------------------------------------
/**
 * Cette fonction s'occupe de la creation du html pour : 
  - Les entrées initiales
  - Les deux tableaux de calculs 
  - Le tracé de la particule et du potentiel 
 */
function genereHtml()
{
  
	
	var divchamp_a_remplir= document.getElementById('champs_a_remplir');

	//on recupere le nombre de fusées rentré par l'utilisateur 
	var nbrefusees_NaN = document.getElementById("nombredefusees").value; 

	//on verfie si ce n'est pas un NaN :
	if(isNaN(nbrefusees_NaN))
	{
		alert(texte.pages_trajectoire.alerte_verifier_nbrefusees);
		document.getElementById("nombredefusees").value=1
		var nbredefuseesgenere = Number(document.getElementById("nombredefusees").value);
	}
	else
	{
		var nbredefuseesgenere = Number(document.getElementById("nombredefusees").value);
	}	

	lenbdefusees=nbredefuseesgenere;

	//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>< Partie entrées ><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
		/*----------------Entrée pour le r_0-------------------- */

	/*On fait une boucle pour le avoir des entrées pour tout les mobile */
	for (count = 1; count <= nbredefuseesgenere; count += 1) 
	{

		/*LABEL MOBILE*/
		var newlabel = document.createElement("Label");
		newlabel.setAttribute("id","label"+count.toString()+"");
		newlabel.innerHTML = "Mobile "+count.toString();
		newlabel.style.position = 'relative';
		newlabel.style.left = '40px'; 
		divchamp_a_remplir.appendChild(newlabel);

		var	divchampsr = document.createElement("div");
		divchampsr.setAttribute("id","divmobile"+count.toString()+"");
		divchampsr.setAttribute("class",'form-container');
		divchamp_a_remplir.appendChild(divchampsr);

		/*SPAN*/
		var span = document.createElement("span"); //on crée un span 
		span.setAttribute("id","rayon"+count.toString()+""); //on lui met un id
		span.setAttribute("class",'input-group');//on met le style css
		divchampsr.appendChild(span);//on ajoute le span

		/* LABEL */
		var newlabel = document.createElement("Label"); //on crée le label
		newlabel.setAttribute("id","ctreastre"); //on lui met un id
		newlabel.setAttribute("title","");//on lui met un titre

		/*on dit que c'est relié à l'input qu'on definir apres
		(pour que si on clique sur le label ça focalise sur l'input)*/
		newlabel.setAttribute("for","r01"); 
		newlabel.innerHTML = " r<sub>0</sub> (m) ="; //on met le texte du label
		span.appendChild(newlabel); //on ajoute le label créé au span

		/* INPUT */
		var newinput = document.createElement("Input"); //on crée le input
		newinput.setAttribute("id","r0"+count.toString()+"");//on lui met un id
		newinput.setAttribute("value","2e13"); // on met la valeur par defaut
		newinput.setAttribute("maxlength","18");//on peut mettre que 18 caracteres 
		newinput.setAttribute("type","text"); //on met que c'est du text
		newinput.setAttribute("size","5");	//on met la taille de la case
		/*On lui associe la fonction *verifnbr* et *initialisationGenerale*,
			si jamais y a un changement on appelle les deux fonctions*/
		newinput.setAttribute("onchange","verifnbr();initialisationGenerale("+nbredefuseesgenere.toString()+")"); 
		newinput.setAttribute("oninput","oninput","resizeInput(this);initialisationGenerale("+nbredefuseesgenere.toString()+")"); 
		span.appendChild(newinput);//on ajoute l'input créé au span

		/*----------------Entrée pour le v_0-------------------- */
		/*Pour savoir qu'est ce qu'on fait à chaque etape, allez plus haut
		tout est expliqué pour le r0, c'est exactement les memes etapes
		avec de differents noms, id et valeurs*/

		/*On fait une boucle pour le avoir des entrées pour tout les mobile */

		/* SPAN */
		var span = document.createElement("span");
		span.setAttribute("id","vitesseu"+count.toString()+"");
		span.setAttribute("class",'input-group');
		divchampsr.appendChild(span);

		/* LABEL */

		var newlabel = document.createElement("Label");
		newlabel.setAttribute("id","vitesseurlabel");
		newlabel.setAttribute("title","");
		newlabel.setAttribute("for","v01");
		newlabel.innerHTML = " v<sub>0</sub> (m/s) =";
		span.appendChild(newlabel);
		
		/* INPUT */
		var newinput = document.createElement("Input");
		newinput.setAttribute("id","v0"+count.toString()+"");
		newinput.setAttribute("value","7.75e7");
		newinput.setAttribute("maxlength","25");
		newinput.setAttribute("type","text");
		newinput.setAttribute("size","5");
		newinput.setAttribute("onchange","verifnbr();initialisationGenerale("+nbredefuseesgenere.toString()+")");
		newinput.setAttribute("oninput", "resizeInput(this)");
		span.appendChild(newinput);


		/*----------------Entrée pour le phi_0-------------------- */

		/*Pour savoir qu'est ce qu'on fait à chaque etape, allez plus haut
		tout est expliqué pour le r0, c'est exactement les memes etapes
		avec de differents noms, id et valeurs*/

		/*On fait une boucle pour le avoir des entrées pour tout les mobile */

		/* SPAN */
		var span = document.createElement("span");
		span.setAttribute("id","idphie"+count.toString()+"");
		span.setAttribute("class",'input-group');
		divchampsr.appendChild(span);

		/* LABEL */
		var newlabel = document.createElement("Label");
		newlabel.setAttribute("id","philabel");
		newlabel.setAttribute("title","");
		newlabel.setAttribute("for","phi01");
		newlabel.innerHTML =" "+htmlDecode("&phi;")+"<sub>0</sub>° =";
		span.appendChild(newlabel);
		

		/* INPUT */
		var newinput = document.createElement("Input");
		newinput.setAttribute("id","phi0"+count.toString()+"");
		newinput.setAttribute("value","0");
		newinput.setAttribute("maxlength","10");
		newinput.setAttribute("type","text");
		newinput.setAttribute("size","5");
		newinput.setAttribute("onchange","verifnbr();initialisationGenerale("+nbredefuseesgenere.toString()+")");
		newinput.setAttribute("oninput", "resizeInput(this)");
		span.appendChild(newinput);

		/*----------------Entrée pour le teta_0-------------------- */

		/*Pour savoir qu'est ce qu'on fait à chaque etape, allez plus haut
		tout est expliqué pour le r0, c'est exactement les memes etapes
		avec de differents noms, id et valeurs*/

		/*On fait une boucle pour le avoir des entrées pour tout les mobile */

		/* SPAN */
		var span = document.createElement("span");
		span.setAttribute("id","tetaid"+count.toString()+"");
		span.setAttribute("class",'input-group');
		divchampsr.appendChild(span);

		/* LABEL */
		var newlabel = document.createElement("Label");
		newlabel.setAttribute("id","thetalabel");
		newlabel.setAttribute("title","");
		newlabel.setAttribute("for","teta1");
		newlabel.innerHTML = " "+htmlDecode("&#632;")+"<sub>0</sub>° =";      //  &#632; c'est phi majuscule
		span.appendChild(newlabel);

		/* INPUT */
		var newinput = document.createElement("Input");
		newinput.setAttribute("id","teta"+count.toString()+"");
		newinput.setAttribute("value","90");
		newinput.setAttribute("maxlength","10");
		newinput.setAttribute("type","text");
		newinput.setAttribute("size","5");
		newinput.setAttribute("onchange","verifnbr();initialisationGenerale("+nbredefuseesgenere.toString()+")");
		newinput.setAttribute("oninput", "resizeInput(this)");
		span.appendChild(newinput);
	}
	
	//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>< Partie 1er Tableau ><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

	//-----------------------------CASES DU HAUT------------------------------------

	/*On recupere l'element defini dans le HTML qui est le tableau
	, puis on insere une nouvelle ligne qu'on appelle newRow*/
	var newRow_sortie=document.getElementById('tableau-sortie').insertRow();

	var jstring_sortie = '<tr id="tgggg1" >' //debut ligne
	/* CASE POUR RAYON DE SCHWARZSCHILD */
	jstring_sortie +='<th class="tg-6l4m" id="rayonschwars" title="" >$rs=\\frac{2GM}{c^{2}}(m)$</th>';
	/* CASE POUR GRAVITE DE SURFACE */
	jstring_sortie +='<th class="tg-6l4m" style="display: none;" id="gravtxt" title="">$grav=\\frac{GM}{R^{2}}\\frac{1}{9.81}(g)$</th>';
	/* CASE POUR VITESSE DE LIBERATION */
	jstring_sortie +='<th class="tg-6l4m" style="display: none;" id="vitesseLibéra" title="">$Vlib=c(\\frac{rs}{R})^{1/2}(m.s^{-1}) $</th>';     //  <---------JPC
	/* CASE POUR TEMPERATURE TROU NOIR */
	jstring_sortie +='<th class="tg-6l4m" style="display: none;" id="TempTrouNoirtxt" title="">$T=6.15*10^{-8}\\frac{M\\odot}{M}(K)$</th>';
	/* CASE POUR TEMPS D'EVAPORATION TROU NOIR */
	jstring_sortie +='<th class="tg-6l4m" style="display: none;" id="tempsEvaporationTrouNoirtxt" title="">$t=6.6*10^{74}(\\frac{M}{M\\odot})^{3}(s)$</th>';
	jstring_sortie +='</tr>'; //fin ligne
	newRow_sortie.innerHTML = jstring_sortie;

	//-----------------------------CASES DU BAS------------------------------------
	var newRow_sortie2=document.getElementById('tableau-sortie').insertRow();

	var jstring_sortie2 = '<tr id="tgggg2" >'//debut ligne
	/* CASE POUR RAYON DE SCHWARZSCHILD */
	jstring_sortie2 +='<td class="tg-3ozo" id="m">0</td>';
	/* CASE POUR GRAVITE DE SURFACE */
	jstring_sortie2 +='<td class="tg-3ozo" style="display: none;" id="g">0</td>';
	/* CASE POUR VITESSE DE LIBERATION */
	jstring_sortie2 +='<td class="tg-3ozo" style="display: none;" id="Vlib">0</td>';
	/* CASE POUR TEMPERATURE TROU NOIR */
	jstring_sortie2 +='<td class="tg-3ozo" style="display: none;" id="TempTN">0</td>';
	/* CASE POUR TEMPS D'EVAPORATION TROU NOIR */
	jstring_sortie2 +='<td class="tg-3ozo" style="display: none;" id="tempsEvapTN">0</td>';
	jstring_sortie2 +='</tr>';	//fin ligne
	/*On met le jstring dans le tableau */
	newRow_sortie2.innerHTML = jstring_sortie2;

	//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>< Partie 2eme Tableau ><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

	var jstring = '<tr id="tgggg1" >' //debut ligne

	for (count = 1; count <= nbredefuseesgenere; count += 1) 
	{
		var newRow=document.getElementById('tableau-sortie-2').insertRow(); //pour mettre quel mobile
		var newRow2=document.getElementById('tableau-sortie-2').insertRow();//1ere ligne 
		var newRow3=document.getElementById('tableau-sortie-2').insertRow(); //2eme ligne
		
		//-----------------------------CASES DU HAUT------------------------------------
		var jstring = '<tr class="label-row">'
		jstring += '<th colspan="4" > Mobile'+count.toString()+ '</th></tr>'; //on met quel mobile
		newRow.innerHTML = jstring;

		var jstring = '<tr id="tgggg2" >'
		/* CASE POUR L */
		jstring += '<th class="tg-aicv">$L'+count.toString()+'(m)$</th>';
		/* CASE POUR E */
		jstring += '<th class="tg-aicv">$E'+count.toString()+'$</th>';
		/* CASE POUR LA VITESSE DES ORBITES CIRCULAIRES*/
		jstring += '<th class="tg-aicv" id="vitesse_orb_circ'+count.toString()+'" title="">$Vcirc'+count.toString()+' (m/s)$</th>'; 
		
		newRow2.innerHTML = jstring;
		//-----------------------------CASES DU BAS------------------------------------

		//C'est cette partie qui concerne les valeurs en chiffres

		/*On recupere l'element defini dans le HTML qui est le tableau
		, puis on insere une nouvelle ligne qu'on appelle newRow*/
		var jstring = '<tr id="tgggg3" >';
		/* CASE POUR L */
		jstring += '<td class="tg-3ozo" id="L'+count.toString()+'">0</td>';
		/* CASE POUR E */
		jstring += '<td class="tg-3ozo" id="E'+count.toString()+'">0</td>';
		/* CASE POUR LA VITESSE DES ORBITES CIRCULAIRES*/
		jstring += '<td class="tg-3ozo" id="Vcirc'+count.toString()+'">0</td>'; 
		
		newRow3.innerHTML = jstring;

	}

	//pour katex il faux mettre un antislash devant le antislash


	//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>< Partie 2eme Tableau ><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

	/*On fait une boucle pour avoir un tableau pour chaque mobile*/
	for (count = 1; count <= nbredefuseesgenere; count += 1) 
	{
		//-----------------------------CASES DU HAUT------------------------------------

		/*On recupere l'element defini dans le HTML qui est le tableau
		, puis on insere une nouvelle ligne qu'on appelle newRow*/
		var newRow=document.getElementById('tableauresultatsimu').insertRow();
		// il faudrait songer a la sécurité ici, 'never trust user input', serait il possible pour un utilisateur de prendre le controle avec ses user input?
		
		newRow.innerHTML  = '<tr id="tg2gga'+count.toString()+'">';//debut ligne
		/*POUR LE R */
		newRow.innerHTML += '<th class="tg-aicv">r(m)</th>';
		/*POUR LE TEMPS PROPRE */
		newRow.innerHTML += '<th id="temps_ecoule'+count.toString()+'" class="tg-aicv"></th>';
		/*POUR LE GRADIENT D'ACCELERATION */
		newRow.innerHTML += '<th id="acceleration'+count.toString()+'" title="" class="tg-6l4m"> Gradient (m.s<sup>-2)</sup>)</th>';
		/*POUR LA VITESSE RADIALE */
		newRow.innerHTML += '<th id="vitesseur'+count.toString()+'" title="" class="tg-aicv"  >V<SUB>r</SUB>(m.s<sup>-1</sup>) </th>';
		/*POUR LA VITESSE ANGULAIRE */
		newRow.innerHTML += '<th id="vitesseuphi'+count.toString()+'" title="" class="tg-6l4m"  >V<SUB>&phi;</SUB>(m.s<sup>-1</sup>)</th>';
		/*POUR LE TEMPS OBSERVATEUR */
		newRow.innerHTML += '<th id="temps_obs'+count.toString()+'" class="tg-aicv"></th>';
		/*POUR LE DECALAGE SPECTRALE */
		newRow.innerHTML += '<th id="decal_spect'+count.toString()+'" title="" class="tg-aicv"></th>';
		/*POUR LA VITESSE TOTAL */
		newRow.innerHTML += '<th id="v_total'+count.toString()+'" title="" class="tg-aicv">   V<SUB>physique</SUB> (m.s<sup>-1</sup>) </th>';
		/*POUR LA DISTANCE PARCOURUE */
		newRow.innerHTML += '<th id="distance_metrique'+count.toString()+'" title="" class="tg-aicv"></th> ';
		/*POUR LE NOMBRE DE G RESSENTI*/
		newRow.innerHTML += '<th id="nb_g'+count.toString()+'" title="" class="tg-6l4m" style="display: none;"></th>';
		/*POUR LE DERNIER G AFFICHÉ */
		newRow.innerHTML += '<th id="dernier_g'+count.toString()+'" title="" class="tg-6l4m" style="display: none;"></th>'
		/*POUR LA PUISSANCE TOTALE CONSOMÉE*/
		newRow.innerHTML += '<th id ="puissance_consommee_label'+count.toString()+'" title="" class="tg-aicv" style="display: none;"></th>'; 
		
		//-----------------------------CASES DU BAS------------------------------------

		/*On recupere l'element defini dans le HTML qui est le tableau
		, puis on insere une nouvelle ligne qu'on appelle newRow*/
		var newRow2=document.getElementById('tableauresultatsimu').insertRow();

		newRow2.innerHTML = '<tr id="tg2ggb'+count.toString()+'">';//debut ligne
		/*POUR LE R */
		newRow2.innerHTML += '<td class="tg-3ozo" id="r_par'+count.toString()+'">res</td>'
		/*POUR LE TEMPS PROPRE */
		newRow2.innerHTML += '<td class="tg-3ozo" id="tp'+count.toString()+'">res</td>'
		/*POUR LE GRADIENT D'ACCELERATION */
		newRow2.innerHTML += '<td class="tg-3ozo" id="ga'+count.toString()+'">res</td>'
		/*POUR LA VITESSE RADIALE */
		newRow2.innerHTML += '<td class="tg-3ozo" id="vr_sc_mas'+count.toString()+'">res</td>'
		/*POUR LA VITESSE ANGULAIRE */
		newRow2.innerHTML += '<td class="tg-3ozo" id="vp_sc_mas'+count.toString()+'">res</td>'
		/*POUR LE TEMPS OBSERVATEUR */
		newRow2.innerHTML += '<td class="tg-3ozo" id="to'+count.toString()+'">res</td>'
		/*POUR LE DECALAGE SPECTRALE */
		newRow2.innerHTML += '<td class="tg-3ozo" id="decal'+count.toString()+'">res</td>'
		/*POUR LA VITESSE TOTAL */
		newRow2.innerHTML += '<td class="tg-3ozo" id="v_tot'+count.toString()+'">res</td>'
		/*POUR LA DISTANCE PARCOURUE */
		newRow2.innerHTML += '<td class="tg-3ozo" id="distance_parcourue'+count.toString()+'">res</td>'
		/*POUR LE NOMBRE DE G RESSENTI*/
		newRow2.innerHTML += '<td class="tg-3ozo" id="g_ressenti'+count.toString()+'" style="display: none;">0</td>'
		/*POUR LE DERNIER G AFFICHÉ */
		newRow2.innerHTML += '<td class="tg-3ozo" id="dernier_g_res'+count.toString()+'" style="display: none;">0</td>'
		/*POUR LA PUISSANCE TOTALE CONSOMÉE*/
		newRow2.innerHTML += '<td class="tg-3ozo" id="puissance_consommee'+count.toString()+'" style="display: none;">0</td>'; 
	} 

	//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>< CANVA POUR LE TRACÉ ><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	//on recupere la valeur de la hauteur du canva
	var canvaswidthheight = '750';
	/*POUR LE TRACÉ DERRIERE LA BOULE*/
	var canvasgenere = document.createElement("canvas");//on crée un element HTML Canva
	canvasgenere.setAttribute("id","myCanvas"); //on lui met un id
	canvasgenere.setAttribute("width",canvaswidthheight); // on definit sa largeur avec la valeur recupérée
	canvasgenere.setAttribute("height",canvaswidthheight);// on definit sa hauteur avec la valeur recupérée
	canvasgenere.setAttribute("class","canvaslaclasse");  // on met un style css
	wrappergenere = document.getElementById('wrapper'); //on recupere l'element Wrapper	créé dans le HTML 
	wrappergenere.appendChild(canvasgenere); //on ajoute le canva sur le Wrapper

	/*POUR L'ENREGISTREMENT*/
	var canvas3genere = document.createElement("canvas");//on crée un element HTML Canva
	canvas3genere.setAttribute("id","myCanvas3three"); //on lui met un id
	canvas3genere.setAttribute("width",canvaswidthheight); // on definit sa largeur avec la valeur recupérée
	canvas3genere.setAttribute("height",canvaswidthheight); // on definit sa hauteur avec la valeur recupérée
	canvas3genere.setAttribute("class","canvaslaclasse"); // on met un style css
	var wrappergenere = document.getElementById('wrapper'); //on recupere l'element Wrapper	créé dans le HTML 
	wrappergenere.appendChild(canvas3genere); //on ajoute le canva sur le Wrapper

	/*POUR LE TRACÉ DE LA BOULE */
	for (count = 1; count <= nbredefuseesgenere; count += 1) 
	{
		var canvasboulegenere = document.createElement("canvas");//on crée un element HTML Canva
		canvasboulegenere.setAttribute("id","myCanvasBoule"+count.toString()+""); //on lui met un id
		canvasboulegenere.setAttribute("width",canvaswidthheight); // on definit sa largeur avec la valeur recupérée
		canvasboulegenere.setAttribute("height",canvaswidthheight); // on definit sa hauteur avec la valeur recupérée
		canvasboulegenere.setAttribute("class","canvaslaclasse"); // on met un style css
		wrappergenere = document.getElementById('wrapper'); //on recupere l'element Wrapper	créé dans le HTML 
		wrappergenere.appendChild(canvasboulegenere); //on ajoute le canva sur le Wrapper

	}
		

	for (count = 1; count <= nbredefuseesgenere; count += 1) 
	{
		/*Pour creer des svg dans les quels on dessine le potentiel*/
		var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");//on crée un element svg
		svg.setAttribute("id", "grsvg_"+count.toString()+""); //on lui met un id
		document.getElementById("wrapper2").appendChild(svg); //on ajoute au Wrapper
		if(nbredefuseesgenere>1)
		{
			document.getElementById("div-choix-potentiel").style.display="inline";
			if(count!=1)
			{
				document.getElementById("grsvg_"+count.toString()+"").style.display="none";
			}
		}
		else 
		{	
			document.getElementById("div-choix-potentiel").style.display="none";
		}

		/*Pour la boite à choix des potentiels*/
		var option=document.createElement("option");
		var text_option=texte.pages_trajectoire.potentiel_option+" "+count.toString();
		option.setAttribute("id", text_option);
		option.innerHTML=text_option;
		document.getElementById("potentiel-choix").appendChild(option); 

		optionsPotentiel[text_option]="grsvg_"+count.toString()+"";

	}


	texteTrajectoireMassive(nbredefuseesgenere); //on met le text adapaté la page HTML
	notationvitesseree2(); //on met les bonnes notations
	infobulleobservateurdistant(); //on met les infobulles
	textegravetetc(); //on met le text adapaté dans les tableaux 


	//pour le bon affichage du katex
	renderMathInElement(document.body, {
		// ...options...
		delimiters:[
			{left:"$",right:'$',display: false},
		]
	});
	   
}// fin fonction genereHtml
  

//----------------------------------------------------{initialisation}----------------------------------------------------

/**
 * Fonction qui permet la récupération des valeurs remplies par l'utilisateur et en fonction le calcul et l'affichage du premier tableau fixe de constantes avant le début de la simulation.
 * @param {Number} compteur : renseigne sur le numéro du mobile qu'on initialise.
 * @returns {Object} mobile : objet contenant toutes les informations sur un mobile/fusée/particule... 
 */
function initialisation(compteur){
	var texte = o_recupereJson(); //Cela me permettra de récupérer le texte pour les infobulles. 
			
	//Je récupère les différentes valeurs rentrées par l'utilisateur :
	M = Number(document.getElementById("M").value); //Masse de l'astre.
	r_phy = Number(document.getElementById("r_phy").value); //Rayon physique de l'astre.
	r0 = Number(document.getElementById("r0"+compteur.toString()).value); //Distance initiale au centre de l'astre.
	v0= Number(document.getElementById("v0"+compteur.toString()).value); //Vitesse initiale du mobile.
	phi0 = Number(document.getElementById("phi0"+compteur.toString()).value); //Angle initiale phi de la position du mobile.
	teta = Number(document.getElementById("teta"+compteur.toString()).value); // Angle initiale phi de la vitesse du mobile.

	teta1=teta; //Je garde une trace de l'angle en degrés avant de le convertir en radians.
	//Je convertis les deux angles obtenus en degrés en radians :
	phi0=(phi0*Math.PI)/180;
	teta=(teta*Math.PI)/180;

	//Je calcule le rayon de Schwarzschild correspondant : 
	m = G * M / Math.pow(c, 2); 
	rs=2*m;

	if(v0>c){ //Je vérifie si la vitesse initiale est supérieure à la vitesse de la lumière.
		alert(texte.pages_trajectoire.alerte_v0_superieure_c); //Si c'est le cas j'ai une alerte et la simulation ne peut pas débuter.
		return;
	}
    
	E=Math.sqrt(1-rs/r0)/Math.sqrt(1-v0**2/c**2); //Je calcule la constante d'intégration sans dimension E.
	dphi_sur_dtau=Math.sin(teta)*v0*E/(Math.sqrt(1-rs/r0)*r0); //Je calcule dphi/dtau. 
	vr=Math.cos(teta)*v0*E; //Je calcule dr/dtau
	L = (dphi_sur_dtau*(r0**2))/c; //Je calcule L la constante d'intégration. 
	
	deltam_sur_m = 0; //J'initialise la valeur du rapport d'énergie consommée pendant le pilotage.
	puissance_instant=0; //J'initialise la valeur de la puissance consommée pendant le pilotage.
	nombre_de_g_calcul = 0; // Pareil pour le nombre de g ressenti. 
	vitesse_precedente_nombre_g = 0; //Pareil pour la vitesse précédent le pilotage. 

	v_rotation = c*Math.sqrt(rs/(2*(r0-rs))); //Calcul de la vitesse pour une orbite circulaire à ce r0.

	//J'affiche dans le tableau les valeurs calculée de L, E, rs, la vitesse pour une orbite circulaire :
	document.getElementById("L"+compteur.toString()).innerHTML = L.toExponential(3);
	document.getElementById("E"+compteur.toString()).innerHTML = E.toExponential(3);
	document.getElementById("Vcirc"+compteur.toString()).innerHTML = v_rotation.toExponential(5); 
	document.getElementById("m").innerHTML = rs.toExponential(3);

	//Je prépare le fait qu'initialement aucune énergie n'a été consommée : 
	document.getElementById("decal"+compteur.toString()).innerHTML = "";

	if (v_rotation>= (c/2)){ //En fonction d'une condition de stabilité j'affiche une infobulle sur la vitesse pour l'orbite circulaire.
		document.getElementById("Vcirc"+compteur.toString()).title=texte.pages_trajectoire.orbite_circulaire_instable; //Si elle est instable.
	}else{
		document.getElementById("Vcirc"+compteur.toString()).title=texte.pages_trajectoire.orbite_circulaire_stable; //Si elle est stable. 
	}

	//Je récupère mon facteur d'échelle : 
	scale_factor = Number(document.getElementById("scalefactor").value);  

	//Je calcule la distance radiale maximale que je pourrais atteindre : 
  	if( (E>0.99999 & E<1.00001) && (L >= 2*rs || L <=-2*rs ) ){ 
		rmax=1.1*r0;
   	} 	
   	else if (E==1 && L==0) {rmax=2*r0; } 
  	else {
		rmax=calcul_rmax(L,r0);  
		if(rmax<r0) {rmax=r0 ;}
	}   

	//--------------------------------Initialisation de mon objet mobile--------------------------------

	mobile = { r0:r0, dphi_sur_dtau:dphi_sur_dtau, vr:vr, L:L, E:E , phi0:phi0  };  //Je créé un objet mobile dans lequel je stocke différentes valeurs initiales associées à ce mobile.

	//J'associe à mon mobile des strings associés à mon graphe de potentiel : 
	mobile["pointsvg"]="pointg"+compteur.toString();
	mobile["graphesvg"]="#grsvg_"+compteur.toString();

	//J'initialise et j'associe d'autres variables à mon objet mobile : 
	mobile["rmax"]=rmax; //Ma position radiale maximale atteinte. 
	mobile["blups"]=0;
	mobile["debut"]=true; //Si je suis au début de ma simulation, initialement oui.

	mobile["condition_trace"]=true //Cette condition c'est pour arreter le tracer et l'affichage quand on en a besoin.

	couleurs = generateurCouleur();
	mobile["couleur"]="rgb("+couleurs[0]+", "+couleurs[1]+", "+couleurs[2]+")";//La couleur générée aléatoirement associée à mon mobile.
	//Les nombres rgb associés à cette couleurs : 
	mobile["red"]=couleurs[0];
	mobile["green"]=couleurs[1];
	mobile["blue"]=couleurs[2];

	rmaxjson[compteur]=rmax; // Je stocke dans la liste rmaxjson à la clé associée à ce mobile la position radiale maximale atteinte.
	mobilefactor[compteur]=scale_factor; //Je stocke dans la liste mobilefactor à la clé associée à ce mobile le facteur d'échelle.
	r0o2[compteur] = r0; //Je stocke dans la liste r0o2 à la clé associée à ce mobile ma distance initiale au centre de l'astre. 

	//--------------------------------Gravité à la surface--------------------------------

	//Je récupère les cellules associée à cette gravité à la surface. 
	gCell = document.getElementById("g");
	gLabelCell = document.getElementById("gravtxt");

  	g=(G*M)/(Math.pow(r_phy,2)*9.81); //Je la calcule.

	if(r_phy==0){ //Dans le cas d'un trou noir je n'affiche pas la case.
		document.getElementById("g").innerHTML=" ";
		gCell.style.display = 'none';
		gLabelCell.style.display = 'none';
	}
	else{ //Autrement je l'affiche avec la valeur. 
		document.getElementById("g").innerHTML=g.toExponential(3);
		gCell.style.display = '';
		gLabelCell.style.display = '';
	}

	//--------------------------------Vitesse de libération--------------------------------

	//Je récupère les cellules associée à la vitesse de libération. 
	VlibLabelCell = document.getElementById("vitesseLibéra");
	VlibCell = document.getElementById("Vlib");

	Vlib=c*Math.pow(rs/r_phy,1/2); //Je la calcule.

	if(r_phy>=rs){ //Dans le cas où mon rayon physique est plus grand que le rayon de SCH j'affiche les cases avec la valeur.
		document.getElementById("Vlib").innerHTML=Vlib.toExponential(3);
		VlibLabelCell.style.display='';
		VlibCell.style.display='';
	}
	else{ //Dans le cas contraire je n'affiche pas les cases. 
		document.getElementById("Vlib").innerHTML=" ";
		VlibCell.style.display = "none";
		VlibLabelCell.style.display = "none";
	
	}

	//--------------------------------Rayonnement de Hawking d'un trou noir & temps d'évaporation du trou noir--------------------------------
	
	//Je récupère les cellules associées :
	TempTrouNoirLabelCell=document.getElementById("TempTrouNoirtxt");
	TempTrouNoirCell=document.getElementById("TempTN");
	tempsEvapTNCell=document.getElementById("tempsEvapTN");
	tempsEvapTNLabelCell=document.getElementById("tempsEvaporationTrouNoirtxt");

	if(r_phy<rs){ //Dans le cas où le rayon physique de l'astre est plus petit que le rayon de Schwarzschild. 

		M_soleil = 1.989e30	; //Masse du soleil en kg.
		Temp_trouNoir = 6.5e-8 * M_soleil/M; //Température du trou noir en K. 
		tempsEvaporation_trouNoir = 6.6e74*((M/M_soleil)**3); //Temps d'évaporation du trou noir en secondes. (Calcul simplifié.)

		//J'affiche les cases avec les valeurs :
		document.getElementById("TempTN").innerHTML=Temp_trouNoir.toExponential(3);
		document.getElementById("tempsEvapTN").innerHTML=tempsEvaporation_trouNoir.toExponential(3);
        TempTrouNoirLabelCell.style.display = '';
        TempTrouNoirCell.style.display = '';
		tempsEvapTNCell.style.display = '';
		tempsEvapTNLabelCell.style.display = '';
	}
	else{ //Autrement je n'affiche pas les cases car vides.
		document.getElementById("TempTN").innerHTML=" ";
		document.getElementById("tempsEvapTN").innerHTML = " ";

		TempTrouNoirLabelCell.style.display = 'none';
		TempTrouNoirCell.style.display = 'none';
		tempsEvapTNCell.style.display = 'none';
		tempsEvapTNLabelCell.style.display = 'none';
	}

	//--------------------------------Graphe--------------------------------

	//Jusqu'à 2 mobiles je peux afficher les entrées sur le graphe. 
	if (compteur==1){
		vphiblab=v0; //Je récupère la vitesse initiale.
		vrblab=phi0*180/Math.PI; //Je récupère l'angle de la position initiale en degrés. 
	}
	if(compteur==2){
		vphi2i = v0; //Je récupère la vitesse initiale. 
		vr2i = phi0*180/Math.PI; //Je récupère l'angle de la position initiale en degrés. 
	}

	boutonAvantLancement(true); //J'associe aux différents boutons les fonctions associées d'avant le lancement. 
	canvasAvantLancement(); //J'affiche l'échelle du canvas avant le début de la simulation. 

	return mobile; //Je récupère au final de cette fonction l'objet mobile correctement initialisé.
} 

//----------------------------------------------------{verifnbr}----------------------------------------------------

/**
 * Fonction qui affiche un message d'erreur si une saisie n'est pas un nombre dans un des champs. 
 */
function verifnbr() {

	var texte = o_recupereJson(); //Pour les messages d'alerte.
	
	//Je récupère les données remplies par l'utilisateur : 
	r_phy = document.getElementById("r_phy").value; //Le rayon physique.
	M = document.getElementById("M").value; //La masse de l'astre. 

	nbrdefuseesverifnbr = Number(document.getElementById("nombredefusees").value); //Le nombre de mobiles. 

	//Pour stocker dans des variables si un des champs n'est pas un nombre pour un mobile :
	var oneboolean=false;
	var twoboolean=false;
	var threeboolean=false;
	var fourboolean=false;
	var indice = 0; //Pour récupérer sur quel mobile il y a une erreur de saisie.

	for (count = 1; count <= nbrdefuseesverifnbr; count += 1) { //Pour chaque mobile :
			//Je récupère la distance initiale au centre de l'astre r0, l'angle de la position et l'angle de la vitesse, ainsi que la vitesse : 
			var r0verifnbr = Number(document.getElementById("r0"+count.toString()+"").value); 
			var phi0verifnbr = Number(document.getElementById("phi0"+count.toString()+"").value); 
			var tetaverifnbr = Number(document.getElementById("teta"+count.toString()+"").value);
			var v0verifnbr = Number(document.getElementById("v0"+count.toString()+"").value);

			if(isNaN(r0verifnbr)){ //Si un seul des mobiles n'a pas de nombre pour r0 alors oneboolean est true. 
				oneboolean=true;
				indice=count;
			}
			if(isNaN(phi0verifnbr)){ //Si un seul des mobiles n'a pas de nombre pour l'angle de position initiale alors twoboolean est true.
				twoboolean=true;
				indice=count;
			}
			if(isNaN(tetaverifnbr)){ //Si un seul des mobiles n'a pas de nombre pour l'angle de vitesse initiale alors threeboolean est true.
				threeboolean=true;
				indice=count;
			}
			if(isNaN(v0verifnbr)){ //Si un seul des mobiles n'a pas de nombre pour la vitesse initiale.
				fourboolean=true;
				indice=count;
			}
	}

	//Si un des champs a pour saisie autre chose que un nombre j'affiche un message d'alerte et je remets la valeur par défaut :
	if (oneboolean){ 
		alert (texte.pages_trajectoire.alerte_verifier_r0);
		document.getElementById("r0"+indice.toString()).value=2e13.toExponential(0);
	}
	if (twoboolean){ 
		alert (texte.pages_trajectoire.alerte_verifier_phi0);
		document.getElementById("phi"+indice.toString()).value=0;
	}
	if (threeboolean){ 
		alert (texte.pages_trajectoire.alerte_verifier_teta);
		document.getElementById("teta"+indice.toString()).value=90;
	}
	if (fourboolean){ 
		alert (texte.pages_trajectoire.alerte_verifier_v0);
		document.getElementById("v0"+indice.toString()).value=7.75e7.toExponential(2);
	}
	if (isNaN(r_phy)){
		alert (texte.pages_trajectoire.alerte_verifier_rphy);
		document.getElementById("r_phy").value=0; 
	}
	if (isNaN(M)){ 
		alert (texte.pages_trajectoire.alerte_verifier_M);	
		document.getElementById("M").value=2e39;														
	}

}

//----------------------------------------------------{trajectoire}----------------------------------------------------

/**
 * Première étape qui lance la partie calculatoire.
 * @param {Number} compteur : numéro du mobile si il y en a plusieurs.
 * @param {Object} mobile : objet baryonique peut être un spationaute ou autre.
 * @returns 
 */
function trajectoire(compteur,mobile) {
	
  	texte = o_recupereJson();

  	if (mobile.debut){

		document.getElementById("tg2").style.display = "table"; //Fait apparaître le tableau des résultats.
		document.getElementById("indic_calculs").innerHTML = texte.pages_trajectoire.calcul_encours; //Affiche que le calcul est en cours.

		SurTelephone(); //Affichage de l'information sur les touches claviers en fonction de la taille de l'écran.

		//Interdiction de changer les valeurs de M, r_phy et le nombre de fusées une fois la simulation lancée : 
		document.getElementById('M').disabled = true; 
		document.getElementById('r_phy').disabled = true;
		document.getElementById('nombredefusees').disabled = true; 

		var nbredefusees = Number(document.getElementById("nombredefusees").value); //Récupère la valeur du nombre de fusées.

		for (countt = 1; countt <= nbredefusees; countt += 1) { //Pour toutes les fusées :
			//Interdiction de changer les valeurs de r0, phi0, v0 et teta une fois la simulation lancée.
			document.getElementById('r0'+countt.toString()+'').disabled = true; 
			document.getElementById('phi0'+countt.toString()+'').disabled = true;
			document.getElementById('teta'+countt.toString()+'').disabled = true;
			document.getElementById('v0'+countt.toString()+'').disabled = true;  
   		}

		//Interdiction de changer les valeurs des modes observateur et spationaute une fois la simulation lancée : 
		document.getElementById('r3').disabled = true; //Observateur.
		document.getElementById('r4').disabled = true; //Spationaute.

		element2=document.getElementById('traject_type2'); //Récupère la valeur de si on est en mode observateur ou en mode spationaute.

		rendreVisibleNbG() //Permet si on est en mode spationaute d'afficher les cases concernant le nombre de g ressenti. 

		if(element2.value == "mobile") { //Si on a une seule fusée et que on est en mode spationaute on affiche le pilotage. 
			document.getElementById("joyDiv").style.visibility='visible';
		}
		else //si on est dans mode observateur on enleve la distance parcourue
		{
			document.getElementById('distance_parcourue'+compteur).style.display='none';
			document.getElementById('distance_metrique'+compteur).style.display='none';	
		}

		document.getElementById('trace_present').value="true"; //Permet de déclarer qu'il y a un tracé. 

	
    	mobile.debut = false; //Permet de dire que nous ne sommes plus au début de la simulation. 

		//--------------------------------Calcul de la trajectoire en elle-même--------------------------------

		mobile["phi"]=mobile.phi0 //J'attribue à l'élement phi du mobile la valeur de phi0 du mobile. 
		mobile["phi_obs"]=mobile.phi0 //J'attribue à l'élément phi_obs du mobile la valeur de phi0 du mobile. 

		temps_chute_libre = Math.PI * rmax * Math.sqrt(rmax / (2 * G * M)) / 2; //Calcul du temps de chute libre. 
		mobile["temps_chute_libre"]=temps_chute_libre; //J'attribue à l'élément temps_chute_libre du mobile la valeur de temps_chute_libre.

		A_init = mobile.vr; //Dans A_init je mets la valeur initiale de vr du mobile.
    	r_init = mobile.r0; //Dans r_init je mets la valeur initiale de r du mobile qui est r0. 

		//--------------------------------Récupération de la distance initiale maximum--------------------------------

		if (nbredefusees==1){//Si je n'ai que un seul mobile.
			if(ifUneFois2){ //On ne passe dans cette condition que une fois. 
				maximum=r0o2[1]; //Je stocke dans la variable maximum la distance initiale la plus grande. 
				cle = 1; //Je récupère l'indice qui correspond à ce maximum dans la liste r0o2 qui contient les r0 de tous les mobiles. 
				ifUneFois2=false; //Je fais en sorte de ne plus revenir dans cette condition. 
			}
		}else if(nbredefusees>=2){ //Si j'ai plusieurs mobiles.
			if(ifUneFois){ //On ne passe dans cette condition que une fois.
				maximum=0; //Stockera le maximum des distances initiales. 
				cle=0; //Stockera l'indice de r0o2 du maximum des distances initiales. 
				for (key = 1; key <= nbredefusees; key += 1) { //Je parcours toute la liste r0o2. 
					if(r0o2[key]>=maximum){ //Je trouve ensuite la valeur de r0 maximum dans r0o2.
						maximum=r0o2[key]; //Je stocke cette valeur dans maximum.
						cle=key; //Je stocke l'indice de cette valeur dans cle. 
					}
					if(key!=cle){ //Si je ne suis pas sur le mobile qui a la distance initiale maximum. 
						mobilefactor[key]=mobilefactor[cle]*(r0o2[key]/r0o2[cle]); //J'attribue à chaque mobile une échelle en fonction du rapport de leur distance initiale sur la distance initiale maximum. 
					}
				}
				ifUneFois=false; //Je fais en sorte de ne plus revenir dans cette condition. 
			}
		}
    
		//--------------------------------Calcul de la trajectoire en elle-même--------------------------------

		A_part = A_init; //Je stocke dans A_part ce qui est actuellement mobile.vr.
    	mobile["A_part"]=A_part; 
    	r_part = r_init; //Je stocke dans r_part ce qui est actuellement la distance initiale du mobile.
    	mobile["r_part"]=r_part; 
    	r_init_obs = mobile.r0; 
    	r_part_obs=r_init_obs;
    	mobile["r_part_obs"]=r_part_obs; 
		A_init_obs = mobile.vr*(1-rs/mobile.r0)/mobile.E; //Je multiplie par dτ/dt pour passer le dr/dτ en observateur. 
   		A_part_obs=A_init_obs; 
		mobile["A_part_obs"]=A_part_obs; 

		distance_parcourue_totale=0; //J'initialise la distance parcourue totale par le mobile dans son propre référentiel. 
		mobile["distance_parcourue_totale"]=distance_parcourue_totale; //La distance totale parcourue devient une valeur spécifique au mobile. 

    	temps_particule = 0; //J'initialise le temps dans le référentiel du mobile. 
    	mobile["temps_particule"]=temps_particule;
   		temps_observateur_distant = 0; //J'initialise le temps dans le référentiel de l'observateur distant. 
    	mobile["temps_observateur_distant"]=temps_observateur_distant;

		Rebond = document.getElementById("reb").value / 100.0; //Je récupère la valeur du rebond remplie par l'utilisateur et je la divise par 100.
    	mobile["Rebond"]=Rebond;

		dtau=temps_chute_libre/1e3;	//Je fixe le pas de temps à une fraction du temps de chute libre. 

    	mobile["dtau"]=dtau;

		//--------------------------------Positions de départ du mobile--------------------------------

    	x1part = mobilefactor[compteur] * mobile.r0 * Math.cos(mobile.phi) / rmax;   //x dans le référentiel du mobile.
    	y1part = mobilefactor[compteur] * mobile.r0 * Math.sin(mobile.phi) / rmax;  //y dans le référentiel du mobile.
    	x1obs = mobilefactor[compteur] * mobile.r0 * Math.cos(mobile.phi_obs) / rmax;  //x dans le référentiel de l'observateur distant.
    	y1obs = mobilefactor[compteur] * mobile.r0 * Math.sin(mobile.phi_obs) / rmax;  //y dans le référentiel de l'observateur distant. 

		//--------------------------------Gestion du canvas--------------------------------

    	canvas = document.getElementById("myCanvas");
    	if (!canvas) { //Si je n'ai pas de canvas récupérable pour la simulation alors message d'alerte et simulation impossible. 
			alert(texte.pages_trajectoire.impossible_canvas);
			return;
    	}

    	context = canvas.getContext("2d"); 
    	if (!context) { //Si je n'ai pas de context de récupérable (interface permettant de dessiner sur le canvas) alors message d'alerte et simulation impossible. 
			alert(texte.pages_trajectoire.impossible_context);
			return;
    	} 

		//on recupere le canva qu'on a créé et on ouvre un context
    	mobile["canvas22"]= document.getElementById("myCanvasBoule"+compteur.toString());
    	mobile["context22"]=mobile["canvas22"].getContext("2d");

		majFondFixe(); //J'efface le canvas et je le remplace par un fond blanc avec le texte visible sur la gauche avec les paramètres d'entrée. 
		
		majFondFixe22(mobile);//J'efface tout ce qui est lié au context22 du mobile, donc tout ce qui est lié à la trajectoire d'un mobile spécifique. 

    	diametre_particule = DIAMETRE_PART; //Je fixe le diamètre de la particule. 

		//Position du centre du canvas :
		posX3 = (canvas.width / 2.0);
    	posY3 = (canvas.height / 2.0);

		//Je définis la position du mobile sur le canvas, vis à vis de son centre, dans le référentiel du mobile :
    	posX1 = posX3 + x1part;
    	posY1 = posY3 + y1part;
    	mobile["positionspatio"]={posX1:posX1, posY1:posY1}

		//Je définis la position du mobile sur le canvas, vis à vis de son centre, dans le référentiel de l'observateur distant :
		posX2 = posX3 + x1obs;
		posY2 = posY3 + y1obs;
    	mobile["position"]={posX2:posX2, posY2:posY2} 
 
    	new Timer(() => animate(compteur,mobile,mobilefactor),compteur, 1, -1); //Créé un nouvel objet Timer qui répète la fonction animate toutes les 1s indéfiniment. 
		//animate calcule les coordonnées de la particule à chaque instant. 

		//--------------------------------Dessin de la boule sur l'enregistrement--------------------------------

		document.getElementById('enregistrer2').addEventListener('click', function() { //Lorsque l'on clique sur enregistrer cela permet d'avoir la boule de la particule sur l'enregistrement.
        	element2z=document.getElementById('traject_type2');
			if (element2z.value != "mobile"){ //Dans le cas de l'observateur distant. 
				//Je dessine la boule du mobile : 
				context3.beginPath();
				context3.fillStyle = COULEUR_BLEU;
				context3.arc(mobile.position.posX2, mobile.position.posY2 , 5, 0, Math.PI * 2);
				context3.lineWidth = "1";
				context3.fill();
			}
			else{ //Dans le cas du spationaute. 
				//Je dessine la boule du mobile :
				context3.beginPath();
				context3.fillStyle = COULEUR_BLEU;
				context3.arc(mobile.positionspatio.posX1, mobile.positionspatio.posY1 , 5, 0, Math.PI * 2);
				context3.lineWidth = "1";
				context3.fill();
			}
    	}, false);

		//--------------------------------Gestion du pilotage--------------------------------

		var X = Number(document.getElementById("pourcentage_vphi_pilotage").value); //Récupération du pourcentage dont on veut modifier vphi à chaque clic.
		var temps_acceleration = 50e-3; //Je fixe le temps d'accélération à 50ms.

		if(element2.value == "mobile" ) { //Dans le cas où j'ai un seul mobile et où je suis en mode spationaute. 
		setInterval(function(){ //Fonction effectuée toutes les 50 ms, qui est le temps de réaction du système fixé. 

			if (isNaN(vtotal) || vtotal >=c){ //Si jamais la vitesse du mobile a déja atteint la vitesse de la lumière ou que la vitesse n'est pas définie, on ne peut pas piloter. 
				pilotage_possible = false;
			}else{
				pilotage_possible = true; 
			}

			if(joy.GetPhi()!=0 && pilotage_possible==true){ 

					vitesse_precedente_nombre_g = vtotal //Stockage de la vitesse précédent l'accélération pour le calcul du nombre de g ressenti. 

					//Pourcentage_vphi_pilotage = X = Delta v tangentielle / vtangentielle

					X_eff = joy.GetPhi()*X;
					
					//Je calcule les variations de E et L si le pilotage est possible:
					if (pilotage_possible) {
					Delta_E= X_eff*vp_1*vp_1/(c*c-vtotal*vtotal)*mobile.E;
          			Delta_L= (X_eff + Delta_E/mobile.E)*mobile.L;
					puissance_instant=Math.abs((Delta_E/mobile.E))*c*c/(temps_acceleration);
					// mise à jour puissance seulement si on reste dans la limite
    				if (deltam_sur_m <= 0.1) {
        			puissance_instant_memo = puissance_instant;}
					deltam_sur_m += Math.abs(Delta_E/mobile.E); //Calcul de l'énergie ΔE/E consommée au total. 
					if ((deltam_sur_m>0.1)) { //Si l'énergie consommée est de 90% de l'énergie de masse, plus de pilotage.
						pilotage_possible = false;  
						deltam_sur_m = 0.1; //Je bloque la valeur à 10%.
						// Désactivation de l'affichage de la puissance lorsque le seuil est atteint
						// document.getElementById("puissance_consommee" + compteur.toString()).style.display = "none"; // Cache l'élément
					}
					mobile.L +=  Delta_L; //Calcul du nouveau L associé à ce mobile.
					mobile.E +=  Delta_E; //Calcul du nouveau E associé à ce mobile. 
					}
											
					document.getElementById("E"+compteur.toString()).innerHTML = mobile.E.toExponential(3); //Affichage sur le site du nouveau E. 
					document.getElementById("L"+compteur.toString()).innerHTML = mobile.L.toExponential(3); //Affichage sur le site du nouveau L. 
					document.getElementById("decal"+compteur.toString()).innerHTML = deltam_sur_m.toExponential(3); //Affichage sur le site de l'énergie consommée. 
					document.getElementById("puissance_consommee"+compteur.toString()).innerHTML = puissance_instant_memo.toExponential(3); //Affichage sur le site de la puissance consommée.
			}
		}, 50);}
		
		//--------------------------------Gestion des boutons d'accélération/décélération--------------------------------

		document.getElementById('plusvite').removeEventListener('click',foncPourVitPlusAvantLancement,false) //Je désassocie la fonction foncPourVitAvantLancement du bouton pour accélérer une fois la simulation commencée.
		document.getElementById('moinsvite').removeEventListener('click',foncPourVitMoinsAvantLancement,false) //Je désassocie la fonction foncPourVitAvantLancement du bouton pour décélérer une fois la simulation commencée.

		Dtau1 = 1e8 * dtau ;  //Pour permettre une accélération.
		mobile["Dtau1"]=Dtau1; //Pour associer ce Dtau1 à un mobile spécifique.
		Dtau2 = dtau/1e8  ;  //Pour permettre une décélération.
		mobile["Dtau2"]=Dtau2; //Pour associer ce Dtau2 à un mobile spécifique.

    	document.getElementById('plusvite').addEventListener('click', function() { //J'associe le bouton accélérer à la fonction suivante une fois la simulation lancée. 
			mobile=bouttons.vitesse(mobile,true); //J'accélère grâce à la fonction vitesse du fichier bouttons. 
			compteurVitesse+=1/nbredefusees;
			document.getElementById('nsimtxt').innerHTML= "simu="+ Math.round(compteurVitesse).toString(); //J'affiche le ns correspondant sur le site.
    	}, false);

    	document.getElementById('moinsvite').addEventListener('click', function() { //J'associe le bouton décélérer à la fonction suivante une fois la simulation lancée. 
			mobile=bouttons.vitesse(mobile,false); //Je décélère grâce à la fonction vitesse du fichier bouttons. 
			compteurVitesse-=1/nbredefusees;
			document.getElementById('nsimtxt').innerHTML= "simu="+ Math.round(compteurVitesse).toString(); //J'affiche le ns correspondant sur le site.
    	}, false);

	
		if(compteurVitesseAvantLancement>0){ //Permet de prendre en compte tous les clics sur accélérer fait avant le début de la simulation. 
			for(i=0;i<(compteurVitesseAvantLancement);i++){
				mobile=bouttons.vitesse(mobile,true)
			}
		}else if (compteurVitesseAvantLancement<0){ //Permet de prendre en compte tous les clics sur décélérer fait avant le début de la simulation.
			for(i=0;i>(compteurVitesseAvantLancement);i--){
				mobile=bouttons.vitesse(mobile,false)
			}
		}

		//--------------------------------Gestion des boutons de zoom--------------------------------
	
		document.getElementById('moinszoom').removeEventListener('click',foncPourZoomMoinsAvantLancement, false); //Je désassocie foncPourZoomMoinsAvantLancement du bouton pour dézoomer une fois la simulation commencée.
		document.getElementById('pluszoom').removeEventListener('click',foncPourZoomPlusAvantLancement, false); //Je désassocie foncPourZoomPlusAvantLancement du bouton pour zoomer une fois la simulation commencée.

    	document.getElementById('moinszoom').addEventListener('click',function(){//J'associe le bouton dézoomer à la fonction suivante une fois la simulation lancée.
      		var retour=bouttons.zoom(false,mobile,canvas,mobilefactor,compteur);  //Utilise la fonction zoom du fichier bouttons.
    		mobile=retour[0]; //Récupère le mobile avec les nouvelles positions sur le canvas.
    		mobilefactor=retour[1]; //Récupère le nouveau facteur d'échelle. 
			factGlobalAvecClef /= Math.pow(1.2,1/nbredefusees ); //Je dézoome de 20%. 
			majFondFixe22(mobile); //Je mets à jour tout ce qui est relié au dessin du mobile. 
        	rafraichir2(context,mobilefactor,rmaxjson,maximum); //Redessine le rayon de SCH et si besoin l'astre sur un fond blanc avec les entrées à gauche. 
			nzoom-=1/nbredefusees; 
			document.getElementById('nzoomtxt').innerHTML= "zoom="+ Math.round(nzoom).toString(); //Mets à jour l'affichage du zoom sur le site. 
    	}, false);


		document.getElementById('pluszoom').addEventListener('click', function() {//J'associe le bouton zoomer à la fonction suivante une fois la simulation lancée.
    		var retour=bouttons.zoom(true,mobile,canvas,mobilefactor,compteur);  //Utilise la fonction zoom du fichier bouttons.
   			mobile=retour[0]; //Récupère le mobile avec les nouvelles positions sur le canvas.
    		mobilefactor=retour[1]; //Récupère le nouveau facteur d'échelle. 
			factGlobalAvecClef *= Math.pow(1.2,1/nbredefusees ); //Je zoome de 20%.
			majFondFixe22(mobile); //Je mets à jour tout ce qui est relié au dessin du mobile.
			rafraichir2(context,mobilefactor,rmaxjson,maximum); //Redessine le rayon de SCH et si besoin l'astre sur un fond blanc avec les entrées à gauche. 
			nzoom+=1/nbredefusees;
			document.getElementById('nzoomtxt').innerHTML= "zoom="+ Math.round(nzoom).toString(); //Mets à jour l'affichage du zoom sur le site. 
		}, false);
  

    	document.getElementById('initialiser').addEventListener('click', function() { //Associe le bouton pour initialiser le zoom à la fonction suivante. 
			var retour=bouttons.initialiser(nbredefusees,mobilefactor,mobile,compteur,canvas); //Utilise la fonction initialiser du fichier bouttons. 
			mobile=retour[0]; //Récupère le mobile avec les nouvelles positions sur le canvas.
			mobilefactor=retour[1]; //Récupère le nouveau facteur d'échelle. 
			factGlobalAvecClef = fact_defaut; //Le zoom redevient celui initial de la simulation. 
			majFondFixe22(mobile); //Je mets à jour tout ce qui est relié au dessin du mobile.
			rafraichir2(context,mobilefactor,rmaxjson,maximum); //Redessine le rayon de SCH et si besoin l'astre sur un fond blanc avec les entrées à gauche. 
			nzoom=0;
			document.getElementById('nzoomtxt').innerHTML= "zoom="+ nzoom.toString(); //Mets à jour l'affichage du zoom sur le site. 
    	}, false);

		//--------------------------------Graphe du potentiel--------------------------------

   		document.getElementById("bloc_resultats").style.display= "block"; //Permet d'afficher le graphe du potentiel en-dessous de la simulation de la trajectoire. 

		function DispartionGraphesPotentiels() { //Fonction qui permet de faire disparaître tous les graphes de potentiel lorsque la case est décochée. 
			for (countt = 1; countt <= nbredefusees; countt += 1) {
				var node = document.getElementById("grsvg_"+countt.toString()+"");
           		if(node){
					if (node.parentNode){
						node.parentNode.removeChild(node);
					}
				}
			}
		}

		if (document.getElementById("toggle").checked==false) { //Lorsque la case pour afficher les graphes de potentiel est décochée j'appelle la fonction définie précédemment. 
			DispartionGraphesPotentiels();
			document.getElementById("div-choix-potentiel").style.display="none";
		}

		//--------------------------------Gestion du canvas--------------------------------

    	document.getElementById('clear').addEventListener('click', function() {//Lorsque j'appuie sur le bouton reset la fenêtre est rechargée et le mode observateur est choisit par défaut. 
      		rafraichir();
    	}, false);

		//Partie qui permet de mettre à l'échelle le dessin de l'astre et du rayon de SCH vis à vis des zooms avant le lancement de la simulation : 
		if (nz_avant_lancement < 0) {
			for (incr = 0; incr > nz_avant_lancement; incr -= 1) {
				mobilefactor[cle] = mobilefactor[cle] / 1.2;
			}
		} else if (nz_avant_lancement > 0) {
			for (incr = 0; incr < nz_avant_lancement; incr += 1) {
				mobilefactor[cle] = mobilefactor[cle] * 1.2;
			}
		}

    	creation_blocs(context,mobilefactor,rmaxjson,maximum); //Je trace le rayon et SCH et si besoin l'astre. 

		//-----------------------------------------------------TRACÉ POTENTIEL -------------------------------------------------
		
		setInterval(function(){ //Fonction qui permet d'avoir un graphe de potentiel dynamique. Ce graphe est renouvelé toutes les 300ms.  
			$('#grsvg_'+compteur.toString()).empty(); //Je vide le contenue du canvas du potentiel.  
			data1=[]; 
			data2=[]; 

			if (element2.value != "mobile"){ //Dans le cas de l'observateur distant. 
	
   				mobile.dr=mobile.r_part_obs*0.6/50; //Je calcule l'incrément dr.
   
				for (r = 0.7*mobile.r_part_obs; r < 1.3*mobile.r_part_obs; r += mobile.dr) { //Je parcours une gamme de valeurs de r centrée autour de mobile.r_part_obs en incrémentant de mobile.dr .
					V = Vr_obs(mobile.E,mobile.L,r)-1 ; //Pour afficher de manière plus pertinente le graphe. 
					data1.push({date: r,close: V}); //Je stocke dans data1 les valeurs de r et V.
				}

				V = Vr_obs(mobile.E,mobile.L,mobile.r_part_obs)-1; //Je calcule le potentiel à la position actuelle.
				data2.push({date: mobile.r_part_obs,close: V}); //Je stocke dans data2 les valeurs de r et V de la position actuelle.

			} else{ //Dans le cas du mobile je procède de manière identique.

				mobile.dr=mobile.r_part*0.6/50; 

				for (r = 0.7*mobile.r_part; r < 1.3*mobile.r_part; r += mobile.dr) { 
					V = Vr_mob(mobile.L,r)-1; 
					data1.push({date: r,close: V}); 
				}
				
				V = Vr_mob(mobile.L,mobile.r_part)-1; 
				data2.push({date: mobile.r_part,close: V}); 
			}

			mobile.point = graphique_creation_pot(0,data1,data2,compteur,mobile); //Trace le graphe du potentiel.

		},120);  
  	} 
	else { //Dans le cas où ce n'est pas le début de la simulation et où je ne suis pas en pause. 
		new Timer(() => animate(compteur,mobile,mobilefactor),compteur, 1, -1); //Créé un nouvel objet Timer qui répète la fonction animate toutes les 1s indéfiniment. 
		//animate calcule les coordonnées de la particule à chaque instant. 
	} 
    
	document.getElementById('start').style.display = "none"; //Une fois la simulation démarrée le bouton start/débuter disparaît.
	document.getElementById('pause/resume').style.display ="inline-block"; //Une fois la simulation démarrée le bouton pause/resume apparaît. 
  
}
	
//----------------------------------------------------{animate}----------------------------------------------------

/**
 * Fonction qui s'occupe de l'animation, tracé et calculs en cours, elle est appelé dans trajectoire() en utilisant un Timer. 
 * @param {*} compteur : Numero du mobile 
 * @param {*} mobile   : mobile en cours de calcul
 * @param {*} mobilefactor : liste des facteurs pour l'echelle
 */

function animate(compteur,mobile,mobilefactor) 
{
	element = document.getElementById('traject_type'); // on recupere le boutton de type de trajectoire
	var element2=document.getElementById('traject_type2');   //on recupere le boutton de observateur ou mobile
	var isrebond = document.getElementById("boutton_ammorti").value; // on recupere la valeur de la barre rebond	 
	
	var temps_acceleration=50e-3; //J'impose le temps d'accélération.

	mobilefactor[compteur] = factGlobalAvecClef //facteur pour l'echelle

	SurTelephone(); //on verifie si on est sur telephone ou ordinateur
	choixTrajectoire(context,mobilefactor,rmaxjson,maximum); // on vérifie le type de trajectoire sélectionné
	
	/*----------------------------------------------------------{{{{  CAS_OBSERVATEUR  }}}-----------------------------------------------------------*/
	if (element2.value != "mobile") 
	//Tout ce qui est dans cette condition concerne le cas du referentiel de l'observateur
	{  
		/* La condition suivante c'est pour arreter le calcul à rs vu que R_phy > rs toujours : */
		if (mobile.condition_trace)
		{	
			/*Cette condition gere la partie trou noir (R_phy=0), dans le cas d'un observateur lointain, on fait les calculs
			jusqu'a rs puis au dela on met les valeurs aux quelles tendent les variables quand r tend vers rs. L'affichage et le tracé
			s'arretent c'est pour ça que ya une variable pour cette condition, ya que temps_observateur qui continue*/
			if (mobile.r_part_obs >rs*1.001)//pas exactement rs pour eviter les problemes de calculs 
			{
				//-----------------------------------------------------PARTIE CALCULE-------------------------------------------------

				//calcul de l'equation differentielle avec RK4 ça donne le r et dr/dt
				val_obs = rungekutta_general(mobile.dtau, mobile.A_part_obs, mobile.r_part_obs, mobile.E, mobile.L, derivee_seconde_Schwarzschild_massif_obs); 
				
				mobile.r_part_obs = val_obs[0]; 		//valeur de r calculée par RK (Runge Kutta)
				mobile.A_part_obs = val_obs[1]; 		//valeur de dr/dtau calculée par RK

				/*Calcul des vitesses dans metrique externe de SCH qui retourne une liste de [v_tot,v_r,v_phi]  (Regarder le fichier 
				Fonctions_utilitaires_trajectoire):*/
				resultat=calculs.MSC_Ex_vitess(mobile.E,mobile.L,mobile.r_part_obs,rs,false);  
				
				/*Les commentaires suivant ont ete ajoutés par M Cordoni parce qu'il y a parfois des problemes avec les calculs des 
				vitesse et du coup on prefere avoir plutot la vitesse avec RK4 parce qu'elle est plus correcte: */

				//vtotal=resultat[0]; //peut servir si jamais ya un probleme dans le calcul des vitesse
				//vr_1_obs=resultat[1]*Math.sign(mobile.A_part_obs);   // <------------JPC  Remarque quand E très proche de 1 calculs.MSC_Ex_vitess donne un résultat[1] faux 
				
				vp_1_obs=resultat[2]; //resulatas de v_phi avec le fichier de calcul de vitesses
				vr_1_obs=mobile.A_part_obs/(1-rs/(mobile.r_part_obs))  // calcul de v_r en utilisant le resultat de l'eqaution differentielle
				vtotal=Math.sqrt(vr_1_obs*vr_1_obs + vp_1_obs*vp_1_obs) ; //calcul du module de la vitesse 

				//Calcul de la variation de l'angle phi pour l'ajouter à la valeur antérieure
				varphi_obs = c * mobile.L * mobile.dtau *(1-rs/mobile.r_part_obs) / Math.pow(mobile.r_part_obs, 2)/mobile.E; 
				mobile.phi_obs=mobile.phi_obs+varphi_obs; //on met à jour le l'angle phi apres avoir calculé le var_phi

				mobile.temps_particule += mobile.dtau*(1-rs/mobile.r_part_obs)/(mobile.E); //calcul du temps propre de du mobile

				z_obs= Math.pow(1-((vr_1_obs*vr_1_obs + vp_1_obs*vp_1_obs)/(c*c)),(-1/2))*Math.pow(1-rs/mobile.r_part_obs,-(1/2))-1 ;//calcul du decalage spectrale
				if(isNaN(z_obs)){z_obs=1/0}
				
				/* Calcul du gradient : */
				gm = derivee_seconde_Schwarzschild_massif_obs(mobile.E,mobile.L,mobile.r_part_obs);
				gmp = derivee_seconde_Schwarzschild_massif_obs(mobile.E,mobile.L,mobile.r_part_obs + 1);
				fm = Math.abs(gm - gmp); 

				/*Calcul de la postion [X,Y] (noramilisées) pour dessiner dans le canva (tracé) */
				mobile.position.posX2 = mobilefactor[compteur] * mobile.r_part_obs * (Math.cos(mobile.phi_obs) / rmax) + (canvas.width / 2.);  
				mobile.position.posY2 = mobilefactor[compteur] * mobile.r_part_obs * (Math.sin(mobile.phi_obs) / rmax) + (canvas.height / 2.); 

			}

			else /* La condition pour s'arreter à rs */
			{

				/*Cette conditions arrete les calculs et attribue les dernieres valeurs qu'il faut */
				if(mobile.r_part_obs!=rs) //Comme ça on rentre qu'une seule fois dans cette condition 
				{
					mobile.r_part_obs=rs; //condition pour que r soit excatement rs 
					/*Pour ce qui suit on met ça à la main car on sait que theoriquement ça tend vers ces valeurs */
					vp_1_obs=0 ;
					vtotal=vr_1_obs=c; 
					z_obs=1/0;
					mobile.condition_trace=false; //on met cette condition à false pour le mobile pour l'arreter le tracé,calculs,et affichage à rs 				
				}
			}
	
			//-----------------------------------------------------PARTIE AFFICHAGE-------------------------------------------------
			
			/*Affichage de toutes les variables dans le tableau */
			document.getElementById("tp"+compteur.toString()).innerHTML = mobile.temps_particule.toExponential(3); //temps mobile
			document.getElementById("ga"+compteur.toString()).innerHTML = fm.toExponential(3); //gradient
			document.getElementById("r_par"+compteur.toString()).innerHTML = mobile.r_part_obs.toExponential(3); //rayon
			document.getElementById("vr_sc_mas"+compteur.toString()).innerHTML = vr_1_obs.toExponential(3); //vitesse radiale (v_r)
			document.getElementById("vp_sc_mas"+compteur.toString()).innerHTML = vp_1_obs.toExponential(3); //vitesse angulaire (v_phi)
			document.getElementById("v_tot"+compteur.toString()).innerHTML = vtotal.toExponential(3);	// vitesse totale (module)
			document.getElementById("decal"+compteur.toString()).innerHTML=z_obs.toExponential(3); //decalage spectral

			//-----------------------------------------------------PARTIE TRACÉ PARTICULE-------------------------------------------------

			//--------------------------------Tracé pour l'enregistrement--------------------------------

			//Dessin du tracé derriere la particule
			context.beginPath(); //on ouvre le context
			context.fillStyle = mobile.couleur; //on choisit la couleur pour remplir parce que c'est fill
			context.rect(mobile.position.posX2, mobile.position.posY2, 1, 1); //on dessine le tracé
			context.lineWidth = "1"; //en choisissant la bonne largeur des traits
			context.fill();		//on le met sur le canva

			majFondFixe22(mobile); //on efface le canva associé au mobile

			//On dessine la boule bleue avec les meme etapes
			mobile["context22"].beginPath();
			mobile["context22"].fillStyle = COULEUR_BLEU;
			mobile["context22"].arc(mobile.position.posX2, mobile.position.posY2 , 5, 0, Math.PI * 2);
			mobile["context22"].lineWidth = '1';
			mobile["context22"].fill();

			//-----------------------------------------------------GESTION REBOND-------------------------------------------------
			if (mobile.r_part_obs <= r_phy ) 
			{
				if (mobile.Rebond != 1 && isrebond == 1 && r_phy > 0) 
				{
					nbRebonds += 1; //on compte le nombre de rebond
					/*puis on calcule les varibles affectées par le rebond :*/
					a = mobile.Rebond; 
					e = Math.sqrt(1 - a); 

					varphi_choc=c * mobile.L * mobile.dtau*(1-rs/mobile.r_part_obs) / Math.pow(mobile.r_part_obs, 2)/mobile.E; 
					mobile.L = mobile.L * e;
					mobile.r_part_obs = r_phy; 

					A_part_obs_init=mobile.A_part_obs;
					mobile.A_part_obs=  -mobile.A_part_obs *e;

					if (Math.abs(A_part_obs_init)>300) 
					{
						//On dessine l'explosion comme un GIF si ya pas d'amortissement 
						setTimeout(function(){mobile["context22"].drawImage(expl1,mobile.position.posX2-50,mobile.position.posY2-50,100,100);},200);
						setTimeout(function(){mobile["context22"].clearRect(mobile.position.posX2-50,mobile.position.posY2-50,100,100);},390);
						setTimeout(function(){mobile["context22"].drawImage(expl2,mobile.position.posX2-50,mobile.position.posY2-50,100,100);},400);
						setTimeout(function(){mobile["context22"].clearRect(mobile.position.posX2-50,mobile.position.posY2-50,100,100);},590);
						setTimeout(function(){mobile["context22"].drawImage(expl3,mobile.position.posX2-50,mobile.position.posY2-50,100,100);},600);
						setTimeout(function(){mobile["context22"].clearRect(mobile.position.posX2-50,mobile.position.posY2-50,100,100);},790);
						setTimeout(function(){mobile["context22"].drawImage(expl4,mobile.position.posX2-50,mobile.position.posY2-50,100,100);},800);
						setTimeout(function(){mobile["context22"].clearRect(mobile.position.posX2-50,mobile.position.posY2-50,100,100);},990);
						setTimeout(function(){mobile["context22"].drawImage(expl5,mobile.position.posX2-50,mobile.position.posY2-50,100,100);},1000);
						setTimeout(function(){mobile["context22"].clearRect(mobile.position.posX2-50,mobile.position.posY2-50,100,100);},1190);
						setTimeout(function(){mobile["context22"].drawImage(expl6,mobile.position.posX2-50,mobile.position.posY2-50,100,100);},1200);
						setTimeout(function(){mobile["context22"].clearRect(mobile.position.posX2-50,mobile.position.posY2-50,100,100);},1390);
						Timer.instances[compteur].stop();//puis on stope la simulation 
						
						
					}        
		
					if (nbRebonds == 1) 
					{
						A_init_obs = A_part_obs_init; //on ré-initialise A_init à la valeur d'accélération au premier rebond
						varphi_init=c * mobile.L * mobile.dtau*(1-rs/r_phy) / Math.pow(r_phy,2)/mobile.E; //on calcule le varphi_init 
					}
					
					V2_init=A_init_obs*A_init_obs+(r_phy*varphi_init*r_phy*varphi_init);

					if (mobile.A_part_obs*mobile.A_part_obs+mobile.r_part_obs*varphi_obs*mobile.r_part_obs*varphi_obs <= V2_init*0.03) //si on rebondit avec 10% de l'accélération du premier rebond, le calcul s'arrête	
					{
						Timer.instances[compteur].stop();//on stope le Timer du mobile concerné 
						textesfinarret();
					}
				}

				else 
				{
					// condition qui gere l'arret à l'astre (R_physique)
					if (r_phy != 0)
					{
						Timer.instances[compteur].stop(); //on stope le Timer du mobile concerné 	
					}
				} 
			}	
			
		}

		/*Le temps observateur est calculé meme quand on rentre dans le trou noir ( r < rs ) */
		mobile.temps_observateur_distant += mobile.dtau //le calcul temps observateur est toujours calculé et affiché sauf si la simulation s'arrete
		document.getElementById("to"+compteur.toString()).innerHTML = mobile.temps_observateur_distant.toExponential(3); //affichage
		
		//Pour garder la position de la boule à rs (si on zoom on l'a plus)
		if(mobile.r_part_obs<=rs)
		{
			mobile["context22"].beginPath();
			mobile["context22"].fillStyle = COULEUR_BLEU;
			mobile["context22"].arc(mobile.position.posX2, mobile.position.posY2 , 5, 0, Math.PI * 2);
			mobile["context22"].lineWidth = '1';
			mobile["context22"].fill();
		}

	}	

	/*----------------------------------------------------------{{{{  CAS_SPATIONAUTE  }}}-----------------------------------------------------------*/
	else     
	//Tout ce qui est dans cette condition concerne le cas du referentiel du spationaute
	{   
		if (mobile.r_part >= 0) 
		{
			//-----------------------------------------------------PARTIE CALCULE-------------------------------------------------

			if (joy.GetPhi()!=0 && pilotage_possible==true){
				val = rungekutta_general(temps_acceleration, mobile.A_part, mobile.r_part, null, mobile.L, derivee_seconde_Schwarzschild_massif);
			}else{
				val = rungekutta_general(mobile.dtau, mobile.A_part, mobile.r_part, null, mobile.L, derivee_seconde_Schwarzschild_massif); //calcul avec RK4 avec le dtau par defaut lorsque pas de pilotage
			}

			mobile.r_part = val[0]; //valeur de r calculée par RK
			mobile.A_part = val[1]; //valeur de dr/dtau calculée par RK
			
			resultat=calculs.MSC_Ex_vitess(mobile.E,mobile.L,mobile.r_part,rs,false); //Calcul des vitesses comme dans le cas de l'observateur mais avec le r dans le referentiel du mobile 
	
			/*MEME REMARQUE QUE LE CAS DE L'OBSERVATEUR POUR CE QUI SUIT */
			//vtotal=resultat[0];
			vr_1=resultat[1]*Math.sign(mobile.A_part);   // <------------JPC  Remarque quand E très proche de 1 calculs.MSC_Ex_vitess donne un résultat[1] faux 
			
			vp_1=resultat[2]; //calcul de v_phi avec le fichier de calcul de vitesses
			//vr_1=mobile.A_part/(1-rs/(mobile.r_part));  //calcul de v_r avec le resultat de RK
			vtotal=Math.sqrt(vr_1*vr_1 + vp_1*vp_1) ;	//calcul de v_tot (module de la vitesse)

			varphi = c * mobile.L * mobile.dtau / Math.pow(mobile.r_part, 2); //calcul de la variation de l'angle 
			mobile.phi = mobile.phi + varphi; //calcul de la nouvelle valeur de l'angle

			mobile.temps_particule+=mobile.dtau  //calcul du temps propre de la particule
			mobile.temps_observateur_distant += mobile.dtau*mobile.E/(1-rs/mobile.r_part);//calcul du temps observateur

			/*Calcul du gradient*/
			gm = derivee_seconde_Schwarzschild_massif(mobile.L,mobile.r_part);
			gmp = derivee_seconde_Schwarzschild_massif(mobile.L,mobile.r_part + 1);
			fm = Math.abs(gm - gmp);	

			/*Calcul de la postion [X,Y] (noramilisées) pour dessiner dans le canva (tracé) */
			mobile.positionspatio.posX1 = mobilefactor[compteur] * mobile.r_part * (Math.cos(mobile.phi) / rmax) + (canvas.width / 2.);  
			mobile.positionspatio.posY1 = mobilefactor[compteur] * mobile.r_part * (Math.sin(mobile.phi) / rmax) + (canvas.height / 2.);
			/*Calcul de la distance parcourue*/
			mobile.distance_parcourue_totale+=vtotal*mobile.dtau; 

			if(joy.GetPhi()!=0 && pilotage_possible==true)
			{ 
				nombre_de_g_calcul = (Math.abs(vtotal-vitesse_precedente_nombre_g)/temps_acceleration)/9.80665 
				
				nombre_de_g_calcul_memo = nombre_de_g_calcul;
			}

			else
			{
				nombre_de_g_calcul_memo = 0;	
			}

			//-----------------------------------------------------PARTIE AFFICHAGE-------------------------------------------------

			//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> AVANT RS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
			
			if(mobile.r_part>rs*1.000001)//pas exactement rs pour eviter les problemes de calculs 
			{
				
				document.getElementById("tp"+compteur.toString()).innerHTML = mobile.temps_particule.toExponential(3); //temps mobile
				document.getElementById("to"+compteur.toString()).innerHTML = mobile.temps_observateur_distant.toExponential(3); //temps observateur
				document.getElementById("r_par"+compteur.toString()).innerHTML = mobile.r_part.toExponential(3);//rayon
				document.getElementById("vp_sc_mas"+compteur.toString()).innerHTML = vp_1.toExponential(3); //vitesse angulaire (v_phi)
				document.getElementById("vr_sc_mas"+compteur.toString()).innerHTML = vr_1.toExponential(3); //vitesse radiale (v_r)
				document.getElementById("v_tot"+compteur.toString()).innerHTML = vtotal.toExponential(3); //vitesse totale
				document.getElementById("ga"+compteur.toString()).innerHTML = fm.toExponential(3);//gradient
				document.getElementById("distance_parcourue"+compteur.toString()).innerHTML=mobile.distance_parcourue_totale.toExponential(3); //distance parcourue
				document.getElementById("g_ressenti"+compteur.toString()).innerHTML = nombre_de_g_calcul_memo.toExponential(3); //nombre de g ressenti par le pilote
				document.getElementById("dernier_g_res"+compteur.toString()).innerHTML = nombre_de_g_calcul.toExponential(3);//dernier nombre de g affiché
			}
		    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> APRES RS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
			else
			{
				document.getElementById("tp"+compteur.toString()).innerHTML = mobile.temps_particule.toExponential(3); //temps mobile
				document.getElementById("to"+compteur.toString()).innerHTML = 1/0; //temps observateur
				document.getElementById("r_par"+compteur.toString()).innerHTML =mobile.r_part.toExponential(3); 
				document.getElementById("ga"+compteur.toString()).innerHTML = fm.toExponential(3);//gradient;
				if(mobile.r_part<0.000001){document.getElementById("ga"+compteur.toString()).innerHTML = 1/0}
				document.getElementById("v_tot"+compteur.toString()).innerHTML ="";
				document.getElementById("vr_sc_mas"+compteur.toString()).innerHTML = "";
				document.getElementById("vp_sc_mas"+compteur.toString()).innerHTML = "";
				document.getElementById("g_ressenti"+compteur.toString()).innerHTML = ""; 		 
				document.getElementById("distance_parcourue"+compteur.toString()).innerHTML= texte.page_trajectoire_photon_kerr.vitesse_pas_définie;
				document.getElementById("g_ressenti"+compteur.toString()).innerHTML = nombre_de_g_calcul_memo.toExponential(3); 
			}

			//-----------------------------------------------------PARTIE TRACÉ-------------------------------------------------

			//--------------------------------Tracé pour l'enregistrement--------------------------------
			//on dessine le trait derriere le mobile
			context.beginPath();
			context.fillStyle = mobile.couleur;
			/*On dessine avec ce qu'on a calculé que si r n'est pas negatif (audela de rs ça donne n'importe quoi) */
			if(mobile.r_part>0){context.rect(mobile.positionspatio.posX1, mobile.positionspatio.posY1, 1, 1);}
			else{context.rect((canvas.width / 2.0), (canvas.height / 2.0), 1, 1);}
			context.lineWidth = "1";
			context.fill();

			majFondFixe22(mobile); //on efface le canva associé au mobile

			//on dessine le mobile au bout du trait
			mobile["context22"].beginPath();
			mobile["context22"].fillStyle = COULEUR_BLEU;
			/*On dessine avec ce qu'on a calculé que si r n'est pas negatif (audela de rs ça donne n'importe quoi) */
			if(mobile.r_part>0){mobile["context22"].arc(mobile.positionspatio.posX1, mobile.positionspatio.posY1 ,5, 0, Math.PI * 2);}
			else{mobile["context22"].arc((canvas.width / 2.0), (canvas.height / 2.0) , 5, 0, Math.PI * 2);}

			mobile["context22"].lineWidth = "1";
			mobile["context22"].fill();
		}

		else
		{
			mobile.r_part=0; // on met quand on s'approche du milieu
			//on affiche les derniéres valeurs avant l'arret de la simulation
			document.getElementById("r_par"+compteur.toString()).innerHTML =mobile.r_part.toExponential(3); 
			//on stop la simulation quand on arrive à r=0
			Timer.instances[compteur].stop();
			
		}
		
		//-----------------------------------------------------GESTION REBOND-------------------------------------------------

		if (mobile.r_part <= r_phy || mobile.r_part==0) 
		{
			if (mobile.Rebond != 1 && isrebond == 1 && r_phy > 0) 
			{
				nbRebonds += 1;//on compte le nombre de rebond
				/*puis on calcule les varibles affectées par le rebond :*/
				a = mobile.Rebond; 
				e = Math.sqrt(1 - a);        
				varphi_choc = c * mobile.L * mobile.dtau / Math.pow(mobile.r_part, 2);
				mobile.L = mobile.L * e;
				mobile.r_part = r_phy;
				A_part_init=mobile.A_part;
				mobile.A_part = -mobile.A_part * e;   

				if (Math.abs(A_part_init)>300) 
				{
					//On dessine l'explosion comme un GIF si ya pas d'amortissement 
					setTimeout(function(){mobile["context22"].drawImage(expl1,mobile.positionspatio.posX1-50,mobile.positionspatio.posY1-50,100,100);},200);
					setTimeout(function(){mobile["context22"].clearRect(mobile.positionspatio.posX1-50,mobile.positionspatio.posY1-50,100,100);},390);
					setTimeout(function(){mobile["context22"].drawImage(expl2,mobile.positionspatio.posX1-50,mobile.positionspatio.posY1-50,100,100);},400);
					setTimeout(function(){mobile["context22"].clearRect(mobile.positionspatio.posX1-50,mobile.positionspatio.posY1-50,100,100);},590);
					setTimeout(function(){mobile["context22"].drawImage(expl3,mobile.positionspatio.posX1-50,mobile.positionspatio.posY1-50,100,100);},600);
					setTimeout(function(){mobile["context22"].clearRect(mobile.positionspatio.posX1-50,mobile.positionspatio.posY1-50,100,100);},790);
					setTimeout(function(){mobile["context22"].drawImage(expl4,mobile.positionspatio.posX1-50,mobile.positionspatio.posY1-50,100,100);},800);
					setTimeout(function(){mobile["context22"].clearRect(mobile.positionspatio.posX1-50,mobile.positionspatio.posY1-50,100,100);},990);
					setTimeout(function(){mobile["context22"].drawImage(expl5,mobile.positionspatio.posX1-50,mobile.positionspatio.posY1-50,100,100);},1000);
					setTimeout(function(){mobile["context22"].clearRect(mobile.positionspatio.posX1-50,mobile.positionspatio.posY1-50,100,100);},1190);
					setTimeout(function(){mobile["context22"].drawImage(expl6,mobile.positionspatio.posX1-50,mobile.positionspatio.posY1-50,100,100);},1200);
					setTimeout(function(){mobile["context22"].clearRect(mobile.positionspatio.posX1-50,mobile.positionspatio.posY1-50,100,100);},1390);          
					Timer.instances[compteur].stop();	//puis on stope la simulation 
				} 

				if (nbRebonds == 1) 
				{
					A_init = A_part_init; //on ré-initialise A_init à la valeur d'accélération au premier rebond
					varphi_init=c * mobile.L * mobile.dtau /Math.pow(r_phy,2);
				}
		
				V2_init=A_init*A_init+(r_phy*varphi_init*r_phy*varphi_init);

				if (mobile.A_part*mobile.A_part+mobile.r_part*varphi*mobile.r_part*varphi <= V2_init*0.03) //si on rebondit avec 10% de l'accélération du premier rebond, le calcul s'arrête	
				{
					Timer.instances[compteur].stop();//on stope le timer concerné
					textesfinarret();
				}		
			}

			else 
			{
				// condition qui gere l'arret à l'astre (R_physique)
				if (r_phy != 0)
				{
					Timer.instances[compteur].stop(); //on stope le Timer du mobile concerné 	
				}
			}

		}
				
		//-----------------------------------------------------AFFICHAGE DES DIODES------------------------------------------------

		/* Diode pour le gradient 
			gradient < 1 ------- vert
			1< gradient < 7 ------- jaune
			gradient > 7 -------  rouge
		*/

		//  Gestion de la diode gradient accélération
	if (element2.value == "mobile"){
		if (Number(fm) <= 1) {
			document.getElementById('DivClignotante'+compteur.toString()).innerHTML = " <img src='./Images/diodever.gif' height='14px' />";
			document.getElementById('DivClignotante'+compteur.toString()).style.color = "green";
		} 
		else if (1 < Number(fm) && Number(fm) < 7) {
			document.getElementById('DivClignotante'+compteur.toString()).innerHTML = " <img src='./Images/diodejaune.gif' height='14px' />";
			document.getElementById('DivClignotante'+compteur.toString()).style.color = "yellow";
		} 
		else if (Number(fm) >= 7) {
			document.getElementById('DivClignotante'+compteur.toString()).innerHTML = " <img src='./Images/dioderouge.gif' height='14px' />";
			document.getElementById('DivClignotante'+compteur.toString()).style.color = "red";
		} 
	}

	    //  Gestion de la diode réserve d'énergie
	if (element2.value == "mobile"){
		if (Number(deltam_sur_m) <= 0.01) {
			document.getElementById('DivClignotantePilot'+compteur.toString()).innerHTML = " <img src='./Images/diodever.gif' height='14px' />";
			document.getElementById('DivClignotantePilot'+compteur.toString()).style.color = "green";
		} 
		else if (0.01 < Number(deltam_sur_m) && Number(deltam_sur_m) < 0.1) {
			document.getElementById('DivClignotantePilot'+compteur.toString()).innerHTML = " <img src='./Images/diodejaune.gif' height='14px' />";
			document.getElementById('DivClignotantePilot'+compteur.toString()).style.color = "yellow";
		} 
		else if (Number(deltam_sur_m) >= 0.1) {
			document.getElementById('DivClignotantePilot'+compteur.toString()).innerHTML = " <img src='./Images/dioderouge.gif' height='14px' />";
			document.getElementById('DivClignotantePilot'+compteur.toString()).style.color = "red";
		} 
	}	
	
		/* Diode pour le nombre de g ressenti
     g_ressenti < 4 ------- vert
     4 < g_ressenti < 9------- jaune
     g_ressenti > 9 ------- rouge
     */
    // Gestion de la diode nombre de g ressenti
    if (element2.value == "mobile") {
        if (nombre_de_g_calcul_memo <= 4) {
            document.getElementById('DivClignotanteNbG'+compteur.toString()).innerHTML = " <img src='./Images/diodever.gif' height='14px' />";
            document.getElementById('DivClignotanteNbG'+compteur.toString()).style.color = "green";
        }
        else if (4 < nombre_de_g_calcul_memo && nombre_de_g_calcul_memo <= 9) {
            document.getElementById('DivClignotanteNbG'+compteur.toString()).innerHTML = " <img src='./Images/diodejaune.gif' height='14px' />";
            document.getElementById('DivClignotanteNbG'+compteur.toString()).style.color = "yellow";
        }
        else if (nombre_de_g_calcul_memo > 9) {
            document.getElementById('DivClignotanteNbG'+compteur.toString()).innerHTML = " <img src='./Images/dioderouge.gif' height='14px' />";
            document.getElementById('DivClignotanteNbG'+compteur.toString()).style.color = "red";
        }
    }
		

	/*si tout les Timers relié aux mobiles sont supprimés on sait que ya plus de calculs en cours alors on met qu'on a fini la simulation*/
	if (Object.keys(Timer.instances).length === 0) 
	{
		document.getElementById("indic_calculs").innerHTML=texte.pages_trajectoire.calcul_termine; //on met que le calculé est fini (voir le Json)
		document.getElementById("pause/resume").style.display='none';  //on enleve les 2 buttons pause
		document.getElementById('bouton_pause').style.display='none'; 
	}
	} 
}   

//----------------------------------------------------{Vr_mob}----------------------------------------------------

/**
 * Expression du potentiel divisé par c² dans la métrique de Schwarzschild extérieure pour une particule massive, dans le référentiel du mobile.
 * @param {Number} L : constante d'intégration, avec la dimension d'une longueur.
 * @param {Number} r : coordonnée radiale, en m. 
 * @returns le résultat du potentiel divisé par c². 
 */
function Vr_mob(L,r){
	return (1-rs/r) * (1+ Math.pow(L/r,2));
}

//----------------------------------------------------{Vr_obs}----------------------------------------------------

/**
 * Expression du potentiel divisé par c² dans la métrique de Schwarzschild extérieure pour une particule massive, dans le référentiel de l'observateur distant. 
 * @param {Number} E : constante d'intégration, sans dimension.
 * @param {Number} L : constante d'intégration, avec la dimension d'une longueur.
 * @param {Number} r : coordonnée radiale, en m. 
 * @returns le résultat du potentiel divisé par c². 
 */
function Vr_obs(E,L,r){
	return Math.pow(E,2) - (1/Math.pow(E,2)) * Math.pow(1-rs/r,2) * (Math.pow(E,2) - (1-rs/r)*(1+Math.pow(L/r,2)));
}

//----------------------------------------------------{derivee_seconde_Schwarzschild_massif}----------------------------------------------------

/**
 * Expression de la dérivée seconde de r par rapport à τ pour une particule massive dans la métrique de Schwarzschild extérieure. 
 * @param {Number} L : constante d'intégration, avec la dimension d'une longueur.
 * @param {Number} r : coordonnée radiale, en m. 
 * @returns le résultat de la dérivée seconde. 
 */
function derivee_seconde_Schwarzschild_massif(L,r){
	return Math.pow(c,2)/(2*Math.pow(r,4)) *  (-rs*Math.pow(r,2) + Math.pow(L, 2)*(2*r-3*rs));
}
//----------------------------------------------------{derivee_seconde_Schwarzschild_massif_obs}----------------------------------------------------

/**
 * Expression de la dérivée seconde de r par rapport à t pour une particule massive dans la métrique de Schwarzschild extérieure. 
 * @param {Number} E : constante d'intégration, sans dimension.
 * @param {Number} L : constante d'intégration, avec la dimension d'une longueur.
 * @param {Number} r : coordonnée radiale, en m. 
 * @returns le résultat de la dérivée seconde. 
 */
function derivee_seconde_Schwarzschild_massif_obs(E,L,r) {
	return -(1/2)*(Math.pow(c,2)/Math.pow(E,2))*(-2*(rs/Math.pow(r,2))*(1-rs/r)*(Math.pow(E,2)-(1-rs/r)*(1+Math.pow(L/r,2))) - Math.pow(1-rs/r,2)*(-(rs/Math.pow(r,2))*(1+Math.pow(L/r,2)) - (1-rs/r)*(-2*(Math.pow(L,2)/Math.pow(r,3)))));
}

//----------------------------------------------------{calcul_rmax}----------------------------------------------------

/**
 * Fonction servant à calculer la distance radiale maximale que peut atteindre le mobile avant de retourner vers le trou noir.
 * @param {Number} L : Constante d'intégration, avec la dimension d'une longueur.
 * @param {Number} r0 : distance initiale au centre de l'astre.
 * @returns {Number} rmax : la distance radiale maximale.
 */
function calcul_rmax(L,r0){
	
	//J'obtiens r1 et r2 qui sont des conditions pour avoir des orbites stables autour d'un trou noir.
	r1 = (L * (L - Math.sqrt(Math.pow(L, 2) - 12 * Math.pow(m, 2))) / (2 * m)); //Distance radiale critique où des transitions d'orbites peuvent se produire. 
	r2 = (L * (L + Math.sqrt(Math.pow(L, 2) - 16 * Math.pow(m, 2))) / (4 * m));  //Distance radiale critique où des transitions d'orbites peuvent se produire pour des L plus élevés.

	/*calculs pour r3, r3 qui est la distance maximale à laquelle une particule peut s'éloigner avant de retourner vers le trou noir :*/
	ra = 2 * m * Math.pow(L, 2);
	rb = ((2 * m / r0) - 1) * Math.pow(L, 2);
	X0 = 1 / r0;
	rc = 2 * m - Math.pow(L, 2) * X0 + 2 * m * Math.pow(L * X0, 2);
	DELTA = Math.pow(rb, 2) - 4 * ra * rc;
	r3 = (-rb - Math.sqrt(DELTA)) / (2*ra); //Point tournant extérieur maximal. 

	
	if (L < 2 * Math.sqrt(3) * m) { 
		/*Cas où je n'ai pas de maximum ou de minimum réel à mon potentiel. 
		Dans ce cas il n'y a pas de changement de direction du mouvement et
		la particule tombe directement dans le trou noir.*/
		rmax = r0;
	}

	else if ( (L <= 4*m) && (L > 2*Math.sqrt(3)*m) ) {
		/*Je suis dans la zone où L > 2*Math.sqrt(3)*m donc je peux éviter de tomber
		directement dans le trou noir mais aussi où je ne peux pas trop m'en éloigner.
		La particule peut donc osciller entre deux points spécifiques.*/

		if ( (Vr_mob(L,r0) <= Vr_mob(L,r1)) && (r0 > r1) ) {
			/*Si l'énergie potentielle effective en r0 est inférieure
			ou égale à r1 alors r0 se trouve en dehors du potentiel local
			minimum et donc la particule oscille entre r0 et r3.
			De plus r0>r1 donc je commence mon mouvement à une 
			position radiale plus éloignée que le premier point tournant r1.*/

			if (r3 > r0) {
				/*La particule peut atteindre r3 avant de revenir.*/
				rmax = r3;
			}
			else if (r3 < r0) {
				/*r0 est encore au-delà des oscillations donc c'est la valeur max.*/
				rmax = r0;
			}
		}
		else {
			/*La particule est en-dessous du point tournant intérieur et tombe donc vers le centre.*/
			rmax = r0;
		}
	}
	else if (L > 4 * m) {
		/* La particule peut maintenir des orbites plus étendues et potentiellement plus stables autour du trou noir, 
		en évitant les orbites instables plus proches de celui-ci.*/

		if (r0 > r2) {
			/*La particule a assez d'énergie pour atteindre une position radiale r3 avant
			de subir les effets gravitationnels significatis et revenir vers l'intérieur*/

			if (r3 > r0) {
				/*r3 est la distance maximale à laquelle la particule peut s'éloigner avant
				de revenir vers l'intérieur.*/
				rmax = r3;
			}
			else if (r3 < r0) {
				/*r0 est déjà la distance maximale atteinte par la particule.*/
				rmax = r0;
			}
		}
		else { /*La particule n'a pas assez d'énergie et est obligée de revenir vers l'intérieur.*/
			rmax = r0;
		}
	}
	return rmax;
}

//----------------------------------------------------{pausee}----------------------------------------------------

/**
 * Cette fonction est associé aux bouttons pause, avec les quels on peut pauser et reprendre la simulation.
 */
function pausee() 
{
	//si le Timer est en marche
	if (!Timer.paused) 
	{
		Timer.paused = true;  //on met le Timer en pause
		document.getElementById("pause/resume").innerHTML =texte.pages_trajectoire.bouton_resume; //on change le texte du boutton pause en haut
		document.getElementById("indic_calculs").innerHTML = texte.pages_trajectoire.calcul_enpause; //on change le texte qui s'affiche "Calculs en pause"
		document.getElementById("pau").title = texte.pages_trajectoire.bouton_lecture; //infobulle du boutton pause en bas
		document.getElementById("pau").src = "./Images/lecture.png"; //on change l'icone du boutton pause en bas
		
	} 
	//si le Timer est en pause
	else 
	{
			Timer.paused = false;//on met le Timer en marche
			document.getElementById("pause/resume").innerHTML = texte.pages_trajectoire.bouton_pause; //on change l'icone du boutton pause en bas
			document.getElementById("indic_calculs").innerHTML = texte.pages_trajectoire.calcul_encours;//on change le texte qui s'affiche "Calculs en cours"
			document.getElementById("pau").title = texte.pages_trajectoire.bouton_pause;//infobulle du boutton pause en bas
			document.getElementById("pau").src = "./Images/pause.png"; //on change l'icone du boutton pause en bas
	}
}

//----------------------------------------------------{rafraichir2}----------------------------------------------------
/**
 * Fonction qui permet d'effacer le fond du canva pour mettre le texte et dessiner l'astre.
 */
function rafraichir2(context,mobilefactor,rmaxjson,r0ou2) 
{
	majFondFixe(); //efface le fond et met le text
	creation_blocs(context,mobilefactor,rmaxjson,r0ou2); //dessine l'astre et l'echelle
}

//----------------------------------------------------{rafraichir}----------------------------------------------------

/**
 * Fonction qui permet de rafraichir la page quand on clique sur reset.
 */
function rafraichir() 
{
	//on rafraichit la page et on met fait de sorte qu'on choisit observateur
	window.location.reload(); 
	element2.value="observateur";
}

// -------------------------------------{enregistrer}--------------------------------------------

/**
 * Fonction qui sert à enregistrer une image de la simulation. 
 */
function enregistrer_trajectoires() {

	var texte = o_recupereJson(); //Pour avoir accès au contenu des fichiers json.

	if (document.getElementById('trace_present').value === "true") {//Lorsqu'il y a un tracé de simulation. 

		//On demande à l'utilisateur le nom du fichier, avec "traject_Schaw_B_PM" comme nom du fichier par défaut : 
		var nomFichier = prompt(texte.pages_trajectoire.message_nomFichier, "traject_Schaw_B_PM");

		//Si l'utilisateur a renseigné un nom de fichier non null et qui n'est pas juste des blancs : 
		if (nomFichier !== null && nomFichier.trim() !== '') { 

			//Je récupère dans canvas3 l'élément d'ID "myCanvas3three" et dans context3 son context :
			canvas3 = document.getElementById("myCanvas3three");
			context3 = canvas3.getContext("2d");

			//Je dessine sur context3 ce qu'il y a dans canvas, donc dans context donc le texte, rs et l'astre et le tracé :
			context3.drawImage(canvas, 0, 0);

			//Dessin du logo :
			var logo = new Image() 
			logo.src='Images/CosmoGravity_logo.png'; //Je récupère le chemin de l'image du logo.
			logo.onload = function() {
				var largeurLogo = 100; //largeur de l'image du logo
				var hauteurLogo = (logo.height / logo.width) * largeurLogo; //hauteur de l'image du logo
				var x = canvas3.width - largeurLogo; // Position en x pour le coin inférieur droit du logo.
				var y = canvas3.height - hauteurLogo; // Position en y pour le coin inférieur droit du logo. 
				context3.drawImage(logo,x,y, largeurLogo, hauteurLogo); //Je dessine le logo sur context3.


			document.getElementById("enregistrer2").click(); //Je dessine la boule sur context3. 
			canvasToImage(canvas3, { //Je transforme le canvas en image :
				name: nomFichier.trim(),
				type: 'png'
			});

			//J'efface tout le contenu du context3 une fois le canvas enregistrer en tant qu'image : 
			majFondFixe3();
		};
		} else { //Si il n'y a pas de nom de renseigné alors j'ai un message d'alerte. 
			alert(texte.pages_trajectoire.alerte_nomFichier);
		}
	} else { //Si il n'y a pas de tracé de simulation alors message d'alerte. 
		alert(texte.pages_trajectoire.message_enregistrer);
	}
}


//----------------------------------------------------{majFondFixe}----------------------------------------------------

//--------------------------------Texte pour l'enregistrement--------------------------------

/**
 * Fonction qui efface le text qu'on met sur le canva.
 */
function majFondFixe()
{
	context.clearRect(0, 0, canvas.width, canvas.height); //on efface ce qui ya sur le canva
	// Ajout d'un fond blanc 
	context.fillStyle = 'white';
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.font = "15pt bold";
	//on met le text (titre et entrées)
	/*TITRE*/
	context.fillStyle = "black";
	context.fillText(texte.page_trajectoire_massive.titre2,5,40);
	context.font = "13pt bold";
	/*ENTREES*/
	context.fillText(texte.pages_trajectoire.entrees,5,70);
	context.font = "11pt normal";
	/*MASSE*/
	context.fillText("M = "+M.toExponential(3)+" kg",5,90);
	/*RAYON PHYSIQUE*/
	context.fillText("r\u209A\u2095\u1D67 = "+r_phy.toExponential(3)+" m",5,110);
	/*POUR REBOND */
	if (document.getElementById("boutton_ammorti").value == 1)
	{
		context.fillText(texte.page_trajectoire_massive.amortissement+" = " +mobile.Rebond,5,130);
	}
	/*POUR LE MODE */
	if(document.getElementById('traject_type2').value=="observateur")
	{
		context.fillText(texte.pages_trajectoire.observateur,5,150);
	} 
	else 
	{ 
		context.fillText(texte.pages_trajectoire.mobile,5,150);
	}
	/*ENTREES MOBILE*/
	context.fillText("mobile1:",5,170); //mobile1
	context.fillText("r\u2080 = "+(r0o2[1]).toExponential(3)+" m",5,190);//r0
	context.fillText("V\u2080 = "+vphiblab.toExponential(3)+" m.s\u207B\u00B9",5,210); //v0
	context.fillText("\u03C6\u2080 = "+vrblab.toExponential(3)+" °",5,230); //phi0

	//on met au max 2 mobiles avec les memes etaps
	nombeuhreudefusees = Number(document.getElementById("nombredefusees").value);
	if (nombeuhreudefusees>=2) 
	{
		context.fillText("mobile2:",5,250); //mobile2
		context.fillText("r\u2080 = "+r0o2[2].toExponential(3)+" m",5,270);
		context.fillText("V\u2080 = "+vphi2i.toExponential(3)+" m.s\u207B\u00B9",5,290);
		context.fillText("\u03C6\u2080= "+vr2i.toExponential(3)+"°",5,310);
	}
}

// -------------------------------------{fonction majFondFixe22}--------------------------------------------
/**
 * Fonction qui efface le canva associé au mobile.
 * @param mobile : mobile en cours de simulation. 
 */
function majFondFixe22(mobile)
{
	mobile["context22"].clearRect(0, 0, canvas.width, canvas.height);
}
// -------------------------------------{fonction majFondFixe33}--------------------------------------------
/**
 * Fonction qui efface le canva pour enregistrement
 */
function majFondFixe3(){
	context3.clearRect(0, 0, canvas.width, canvas.height);
}

//----------------------------------------------------{test_inte}----------------------------------------------------

// Fonction de verification par rapport à R_phy r0 et rs avant lancement 
function test_inte() {
	
	/*variables pours verifier 3 conditions differentes:*/
	var onebol=false;
	var twobol=false;
	var threebol=false;
	var nombre_de_fusees = Number(document.getElementById("nombredefusees").value);

	/*On boucle sur tout les fusees pour voir si tout est bon:*/
	for (count = 1; count <= nombre_de_fusees; count += 1) {
		var r0testinte = Number(document.getElementById("r0"+count.toString()+"").value); 
		if(r0testinte<0){
			onebol=true;
		}
		if(r0testinte<=rs){
			twobol=true;
		}
		if(r0testinte<r_phy){
			threebol=true;
		}
	}

	var texte = o_recupereJson();//recuperer le texte du json
	
	/*Si la condition r>r_phy>rs n'est pas verifié on renvoie un message d'erreur adapté à la situation*/
	if (r_phy < 0 || onebol) {
		return texte.pages_trajectoire.rayon_neg;
	} 
	else if (r_phy <= rs && r_phy!=0)   {
		return texte.pages_trajectoire.rayonPhyInfHorz;
	} 
	else if (twobol) {
		return texte.pages_trajectoire.rayonHorzInfRayonSchw;
	} 
	else if(threebol){
		return texte.pages_trajectoire.lancerInterdit;
	}
	//sinon on revoit un true pour lancer la simulation
	else
	{
		return true;
	}
}

//----------------------------------------------------{creation_blocs}----------------------------------------------------

/**
 * Fonction qui dessine le cercle du rayon de SCH (cercle ou cible), si besoin l'astre, le texte du titre et des entrées
 * ainsi que l'échelle sur le canvas de la simulation. 
 * @param {Object} context : contexte du canvas de la simulation. 
 * @param {Array} mobilefactor : Liste qui contient les facteurs d'échelle des mobiles.
 * @param {Array} rmaxjson : Liste qui contient les coordonnées radiales maximales des mobiles.
 * @param {Array} r0ou2 : Liste qui contient les distances initiales des mobiles.
 */
function creation_blocs(context,mobilefactor,rmaxjson,r0ou2){

	context.lineWidth = "1"; //Définit l'épaisseur de la ligne utilisée pour les tracés à 1 pixel.

	if ((mobilefactor[cle] * m / rmaxjson[cle]) < 3) { //Si le cercle du rayon de SCH est trop petit vis à vis de l'échelle du graphe :

		//Alors j'affiche l'astre comme une cible bleu : 
		context.beginPath();
		context.strokeStyle = COULEUR_RS;
		context.moveTo(posX3 - 10, posY3);
		context.lineTo(posX3 - 3, posY3);
		context.stroke();
		context.beginPath();
		context.moveTo(posX3 + 3, posY3);
		context.lineTo(posX3 + 10, posY3);
		context.stroke();
		context.beginPath();
		context.moveTo(posX3, posY3 - 10);
		context.lineTo(posX3, posY3 - 3);
		context.stroke();
		context.beginPath();
		context.moveTo(posX3, posY3 + 3);
		context.lineTo(posX3, posY3 + 10);
		context.stroke();

  	} 
	else { //Autrement j'affiche le cercle du rayon de SCH :

		context.beginPath();
		context.strokeStyle = COULEUR_RS;
		context.setLineDash([5, 5]);
		context.arc(posX3, posY3, ((mobilefactor[cle] * 2 * m / rmaxjson[cle])), 0, Math.PI * 2);
		context.stroke();

  	}

	if (m < r_phy) { //Si le rayon physique est plus grand que la moitié de rs alors : 

		//Je dessine le disque pour le rayon physique : 
		context.beginPath();
		context.fillStyle = COULEUR_RPHY;
		context.setLineDash([]);
		context.arc(posX3, posY3, (mobilefactor[cle] * r_phy / rmaxjson[cle]), 0, Math.PI * 2);
		context.fill();

		//Et le cercle pour le rayon de SCH :
		context.beginPath();
		context.strokeStyle = COULEUR_RS;
		context.setLineDash([5, 5]);
		context.arc(posX3, posY3, ((mobilefactor[cle] * 2 * m / rmaxjson[cle])), 0, Math.PI * 2); 
		context.stroke();
	}

	context.fillStyle = 'white'; //Ajout d'un fond blanc pour l'exportation.

	//--------------------Dessin du texte du titre et des entrées--------------------
	context.font = "15pt bold";
	context.fillStyle = "black";
	context.fillText(texte.page_trajectoire_massive.titre2,5,40);
	context.font = "13pt bold";
	context.fillText(texte.pages_trajectoire.entrees,5,70);

	//--------------------calculs pour la barre d'échelle--------------------
	r2bis=(80*r0ou2)/(factGlobalAvecClef);
	r1bis=Math.round((80*r0ou2)/(factGlobalAvecClef*10**testnum(r2bis)));
	ech=r1bis*10**testnum(r2bis);

	//--------------------Dessin du texte de la barre d'échelle--------------------
	context.font = "11pt normal";
	context.fillStyle = COULEUR_RS;
	context.fillText(ech.toExponential(1)+" m",605,90);
	context.stroke();

	//--------------------Dessin de la barre d'échelle--------------------
	context.strokeStyle = COULEUR_RS;
	context.beginPath();
	context.setLineDash([]);

	context.moveTo(600,110);
	context.lineTo(600+((r1bis*10**testnum(r2bis))*factGlobalAvecClef)/r0ou2,110);

	context.moveTo(600,105);
	context.lineTo(600,115);

	context.moveTo(600+((r1bis*10**testnum(r2bis))*factGlobalAvecClef)/r0ou2,105);
	context.lineTo(600+((r1bis*10**testnum(r2bis))*factGlobalAvecClef)/r0ou2,115);

	context.stroke();
}

//----------------------------------------------------{choixTrajectoire}----------------------------------------------------

/**
 * Fonction qui permet de préparer le canvas de la simulation en fonction de si on choisit une trajectoire complète ou simple. 
 * @param {Number} compteur : numéro de la fusée entre 0 et le nombre de fusées total, sans dimension. 
 * @param {object} context : objet de contexte de rendu 2D obtenu à partir d'un élément <canvas> en HTML. Cet objet de contexte de rendu 2D contient toutes les méthodes et propriétés nécessaires pour dessiner la simulation en terme de graphes.
 * @param {Number} mobilefactor : le facteur d'échelle lié à ce mobile, sans dimension.
 * @param {Number} rmaxjson : valeur maximale de la coordonnée radiale, en m.   
 * @param {Number} r0ou2 : distance initiale au centre de l'astre qui est la plus grande parmi les différentes mobiles, en m.  
 */
function choixTrajectoire(context,mobilefactor,rmaxjson,r0ou2) {
    if (element.value == 'simple') {
		    majFondFixe();
        creation_blocs(context,mobilefactor,rmaxjson,r0ou2);
		    diametre_particule = DIAMETRE_PART*2;
	}else if (element.value=='complete'){
        diametre_particule = DIAMETRE_PART;
    }
}

//----------------------------------------------------{recuperation}----------------------------------------------------

/**
 * Fonction qui sert à faire fonctionner le bouton valeurs précédentes lorsque aucune simulation n'a été démarrée. 
 */
function recuperation(){

	if(document.getElementById('trace_present').value!="true"){ //Dans le cas où aucune simulation n'a demarée.
		load_schwarshild_massif(); //Récupère les valeurs de la dernière simulation.
		var lenbdefusees = Number(document.getElementById("nombredefusees").value); //Récupère le nombre de mobiles.
		initialisationGenerale(lenbdefusees); //Permet le calcul et l'affichage du tableau fixe de constantes avant le début de la simulation. 
	}

}