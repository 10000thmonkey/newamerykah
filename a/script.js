/*
DOMSTER - jQuery on aSteroids

INCLUDES
	1 DOM manipulation shorthands
	2 ajax functions
	3 DOMContentReady shorthand - q(()=> {...})


1 DOM
Can be chained, e.g. q(selector).addClass().remove().content()...
	- q() - both $(selector) and $.find(selector)
	- remove()
	- toggleClass(), addClass(), removeClass(), hasClass()
	- on() = addEventListener
	- css(), attr() - either gets, or, if second arg present, sets

	ON SINGLE NODE:
	- closestParent() - finds the closest element up the DOM, by tag name now

	ON FORMS
	- serialize() - returns object of form inputs and values
*/
 

jax = {
	// jax.get (string url, function callback, function error)
	get:function(u,clb,err,headers = false)
	{
		var x=new XMLHttpRequest();
		x.open("GET",u,true);
		if ( typeof headers == "object" && headers.length != 0) {
			for(let h of headers) {
				x.setRequestHeader(h[0],h[1]);
			}
		}
		x.onreadystatechange=function(e){
		  if(x.readyState==4) {
		   clb ? clb(x.response): null;
		  }
		};
		x.send(null);
		},
	// jax.post (string url, object data, function callback, function error)
	post: function(u,d,cb,er,headers=false)
	{
		var x=new XMLHttpRequest();
		x.open("POST",u,true);
		if ( typeof headers == "array" && headers.length != 0) {
			for(let h of headers) {
				x.setRequestHeader(h[0],h[1]);
			}
		} else {
			x.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		}
		x.onreadystatechange=function(e){
		  if(x.readyState == 4) {
			if(x.status == 200) {cb ? cb(x.response): null;}
			else if(x.status != 200) {er ? er(x) : null;}
		  }
		};
		x.send(new URLSearchParams(d));
	},
	// synchronous, DEPRECATED
	sync:function(u,m,d)
	{
		var x=new XMLHttpRequest(),
			d=d||null,
			m=m||"GET";
		if(m=="GET"){
		  x.open("GET",u,false);
		  x.send(d);
		}
		if(m=="POST") {
		  x.open("POST",u,false);
		  x.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		  x.send(jax.params(d));
		}
		if(x.readyState==4) {
		  return x.responseText;;
		}
	},
	getJs:function(u,c){var s=document.createElement("script");s.src=u; s.classList.add("templatescript");document.head.appendChild(s)}
};



window.createNode = function (element = "div", classes = undefined) {
	let el = document.createElement(element);
	if (classes) el.addClass(classes);
	return el;
};

window.q = function (q) {
	if (typeof q == "function") return document.on("DOMContentLoaded", (e)=>q(e));
	let res = (this == window) ? document.querySelectorAll(q) : this.querySelectorAll(q);
	return res; 
};

Node.prototype.q = function (sel) {return this.querySelectorAll(sel)};
Node.prototype.qq = function (sel) {return qq.apply(this, [sel])};
NodeList.prototype.q = function(c) {
	var list = [];
	this.each( function() {
		list.push(...this.q(c));
	} );
	return new NodeListConstruct(list);
}

Node.prototype.insert = function (el = "") {
	const parent = this;
	if ( el instanceof NodeList) {
		//console.log(el);
		for( let e of el ) {
			//console.log(e);
			parent.appendChild( e );
		};
	} else if (el instanceof Node) {
		parent.appendChild(el);
	}
	return parent;
};
NodeList.prototype.insert = function (el) { this[0].insert(el); return this; }

Node.prototype.remove = function () {return this.parentElement.removeChild(this);};
NodeList.prototype.remove = function () {
	return this.each( function () { this.remove() } ); }


Node.prototype.toggleClass = function (name) {this.classList.toggle(name);return this;};
Node.prototype.removeClass = function (name) {this.classList.remove(name);return this;};
Node.prototype.addClass = function (name) {
	if(typeof name == "object" || typeof name == "array") {
		for(let c of name) {
			this.classList.add(c);
		}
	} else {
		this.classList.add(name);
	}
	return this;
}
Node.prototype.hasClass = function (name) {return this.classList.contains(name);};
NodeList.prototype.toggleClass = function (c) {
	return this.each( function () { this.toggleClass(c) } ); }
NodeList.prototype.removeClass = function (c) {
	return this.each( function () { this.removeClass(c) } ); }
NodeList.prototype.addClass = function (c) {
	return this.each( function () { this.addClass(c) } ); }
NodeList.prototype.hasClass = function (c) {
	return this.each( function () { this.hasClass(c) } ); }


Node.prototype.on = function (name,callback,r = undefined) {
	if (r === undefined)
		this.addEventListener(name,callback);
	else if (r === true || r === "remove")
		this.removeEventListener(name,callback);
	return this;
};
NodeList.prototype.on = function (n, c, r = undefined) {
	return this.each( function () { this.on(n, c, r) } ); }


Node.prototype.html = function (text) {
	if (text !== undefined) {
		this.innerHTML = text;
		return this;
	} else {
		return this.innerHTML;
	}
};
NodeList.prototype.html = function (c) {
	return this.each( function() { this.html(c);
	} ); };

Node.prototype.css = function(name,value){if(value===undefined){return this.style[name];}else {this.style[name] = value;return this;}};
NodeList.prototype.css = function (c, v) {
	return this.each( function () { this.css(c, v) } ); }

Node.prototype.attr = function(name,value) {
	if(value === undefined){
		return this.getAttribute(name);
	}
	else if (value === true){
		this.attr(name,name);
	}
	else if (value === false) {
		this.removeAttribute(name);
		return this;
	} else {
		this.setAttribute(name,value);
		return this;
	}
};
NodeList.prototype.attr = function (c, v) {
	return this.each( function () { this.attr(c, v) } ); }


Node.prototype.hide = function() {this.addClass("hidden");return this;}
Node.prototype.show = function() {this.removeClass("hidden");return this;}
NodeList.prototype.hide = function() {return this.each(function(){this.hide();})}
NodeList.prototype.show = function() {return this.each(function(){this.show();})}
Node.prototype.toggleHide = function() {return this.toggleClass("hidden");};

Node.prototype.noDisplay = function() {this.addClass("nodisplay");return this;}
Node.prototype.display = function() {this.removeClass("nodisplay");return this;}
NodeList.prototype.noDisplay = function() {return this.each(function(){this.noDisplay();})}
NodeList.prototype.display = function() {return this.each(function(){this.display();})}





Node.prototype.closestParent = function (sel) {
	var el = this;
	while(el.nodeName.toLowerCase() != sel.toLowerCase()) {
		if(el.nodeName == "BODY") continue;
		el = el.parentNode;
	}
	return el;
};
NodeList.prototype.each = function(c) {
	for (var i = this.length; i > 0; i--) {
		c.apply(this[i - 1]);
	}
	return this;
};



//patch to achieve creation of artificial NodeList 
NodeList.prototype.item = function item(i) {
	return this[+i || 0];
};
function NodeListConstruct (array) {
	return Reflect.construct(Array, array, NodeList);
}

//??
var ListElement = (obj) => {
  var el = createNode("list");
  obj.selectable ? el.addClass("selectable"):null;
};
ListElement.prototype = {
  item: () => console.log(this)
}

HTMLFormElement.prototype.serialize = function () {
	var r = {};
	for (e of this.elements) r[e.name] = e.value;
	return r;
}

Node.prototype.messagebox = function (msg, type = "info", icon = "") {
	if (icon !== "") icon = "<i class='nvicon nvicon-"+icon+"'></i>"; 
	this.q(".messagebox").remove();
	this.insert(createNode("div").addClass(["messagebox",type]).html(icon + msg));
}

String.prototype.fill = function( values ) {
	let formatted = this;
	let keys = Object.keys(values);

	for( let i = 0; i < keys.length; i++ ) {
		formatted = formatted.replace("{$" + keys[i] + "}", values[keys[i]]);
	}
	return formatted;
};
String.prototype.escapeAttr = function () {
	return this.replaceAll('"', '&#34;').replaceAll(' ', '&#32;');
}





































window.nv = {};

class NVElement extends HTMLElement {
	constructor() {
		super();
		//this.css("display", "block");

	}

	connectedCallback() {}

	prepareTemplate ( templateHTML, keys, values )
	{
		let newTemplateHTML = templateHTML;

		for ( let key of keys )
		{
			let value = values[key];

			switch ( typeof value ) {
				case "number":
					value = String( parseInt( value ) );
					break;
				case "object":
				case "array":
					value = JSON.stringify( value ).escapeAttr();
					break;
			}
			newTemplateHTML = newTemplateHTML.replaceAll( "{$" + key + "}", value.escapeAttr() );
			newTemplateHTML = newTemplateHTML.replaceAll( "{!" + key + "}", value );
		}
		return document.createRange().createContextualFragment( newTemplateHTML );
	}
}




/*


					MODAL

*/


class NVModal extends NVElement
{
	constructor()
	{
		super();
	}

	connectedCallback()
	{
		window.nv.modal[ this.id ] = this;

		this.on( "click", this._outerClickHandler );

		setTimeout( ()=>{
			this.q("[nv-modal-close]").on("click", () => this.closeModal() );
			document.q("[nv-modal-open="+this.id+"]").on("click", () => this.openModal() );
		}, 5);
	}
	disconnectedCallback()
	{
		delete window.nv.modal[ this.id ];

		this.on( "click", this._outerClickHandler, "remove" );
	}

	static get observedAttributes()
	{
		return ["open"];
	}

	attributeChangedCallback( name, vold, vnew )
	{
	}


	_outerClickHandler (e)
	{
		if ( e.composedPath().indexOf( this.firstElementChild ) == -1 )
		{
			this.closeModal();
		}
	}
	openModal ()
	{
		this.attr("open", true);
		document.body.css( "overflow", "hidden" );
	}
	closeModal ()
	{
		this.attr("open", false);
		document.body.css( "overflow", "initial" );
	}

}
window.nv.modal = {};
customElements.define( "nv-modal", NVModal );







class NVForm extends HTMLFormElement
{
	constructor()
	{
		super();

		this.on( "submit", (e) =>
			{
				e.preventDefault();

				jax.send(
					"/wp-admin/admin-ajax.php",
					
				);

			}
		);
	}

	connectedCallback()
	{
		window.nv.forms[ this.id ] = this;

		setTimeout( () =>
		{

		}, 10 );
	}

	disconnectedCallback() {
		// browser calls this method when the element is removed from the document
		// (can be called many times if an element is repeatedly added/removed)
	}

	static get observedAttributes() {
		return [/* array of attribute names to monitor for changes */];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		// called when one of attributes listed above is modified
	}

  // there can be other element methods and properties
}
window.nv.forms = {};
customElements.define( "nv-form", NVForm );






/*

					Repeatable components


*/






class NVRepeat extends NVElement
{
	constructor ()
	{
		super();

		this._items = [];
		this._fill = [];
	}

	//static get observedAttributes () { return ["nv-items"]; }

	connectedCallback ()
	{
		setTimeout( () =>
		{
			let template = this.q("template")[0];
			this._template = template.cloneNode(true);
			template.remove();

			if ( this.q("nv-items").length > 0 ) {
				this._feed = this.q("nv-items")[0];
			} else {
				this._feed = createNode("nv-items");
				this.insert( this._feed );
			}

			if ( this.attr("nv-fill") ) this._fill = this.attr("nv-fill").split(",");

			if ( this.attr("nv-inner-class") ) {
				this._feed.addClass( this.attr("nv-inner-class").split(" ") );
				this.attr("nv-inner-class", false);
			}

			if ( this.attr("nv-items") ) {
				this.addItems( JSON.parse( this.attr("nv-items") ) );
				this.attr("nv-items", false);
			}
		}, 5 );
	}

	addItems ( items )
	{
		this._items.push( ...items );

		let keys = this._fill.length > 0 ?
			this._fill :
			Object.keys( items[0] );

		for (let item of items) {
			this._feed.insert( this.prepareTemplate( this._template.innerHTML, keys, item ) );
		}

		return this;
	}

	cleanItems ()
	{
		this._items = [];
		this._feed.innerHTML = "";

		return this;
	}
}
customElements.define( "nv-repeat", NVRepeat );




class NVSlider extends NVElement
{
	constructor() { super(); }

	connectedCallback()
	{
		setTimeout( () =>
		{
			const slider = this;
			const items = this.q("article, a");

			const slider_items = createNode().addClass("slider-items");
			slider_items.insert( items );


			if (typeof this.attr("controls") == "string")
			{
				const controls_wrapper = createNode().addClass("slider-controls");

				let prev = createNode( "nv-button", ["slider-prev", "nvicon", "nvicon-arrow-left"] )
				.on( "click", () =>
				{
					for ( let item of items )
					{
						if ( slider_items.scrollLeft > item.offsetLeft ) 
						{
							slider_items.scrollTo( {
								left: item.offsetLeft,
								top: 0,
								behavior: "smooth"
							} );
						}
					}
				} );

				let next = createNode( "nv-button", ["slider-next", "nvicon", "nvicon-arrow-right"] )
				.on( "click", () =>
				{
					for ( let i = 0; i < items.length; i++ )
					{
						console.log("next!");
						if ( slider_items.scrollLeft < items[i].offsetLeft ) 
						{
							console.log("next!");
							slider_items.scrollTo( {
								left: items[i+1].offsetLeft,
								top: 0,
								behavior: "smooth"
							} );
							break;
						}
					}
				} );

				controls_wrapper.insert( next );
				controls_wrapper.insert( prev );

				slider.insert( controls_wrapper ); 
			}

			slider.insert( slider_items ); 
		}, 10 );
	}

  // there can be other element methods and properties
}
customElements.define( "nv-slider", NVSlider );





class NVFeed extends NVRepeat
{
	constructor () {
		super();
	}
	connectedCallback () {
		super.connectedCallback();
		setTimeout ( () =>
		{
			this._spinner =
				createNode("div", ["spinner-wrapper", "hiding", "hidden"] )
					.insert( createNode("div", "spinner") );
			
			this.insert( this._spinner );
			this.feedFetch();
		}, 5 );
	}
	feedFetch()
	{
		if (this.attr("nv-ajax-get"))
		{
			this.spinnerShow();
	 
			let params = { action: this.attr("nv-ajax-get") };

			if ( this.attr("nv-ajax-params") ) {
				let urlparams = Object.fromEntries( new URLSearchParams( location.search ) );
				let attrparams = this.attr("nv-ajax-params").split(",");

				for ( let key of attrparams ) if ( urlparams[ key ] ) params[ key ] = urlparams[ key ];
			} else {
				params = Object.assign( params, Object.fromEntries( new URLSearchParams( location.search ) ) );
			}

			jax.post(
				"/wp-admin/admin-ajax.php",
				{ ...params },
				( response ) =>	{
					let data = JSON.parse( response );

					if ( parseInt( data.status ) === 0 )
					{
						this.cleanItems().addItems( data.items ).removeClass("feed-filtered");
					}

					if ( this.q("#button-loadmore").length > 0 )
					{
						if ( ! parseInt(data.more) ) loadMoreBtn.noDisplay();
						else loadMoreBtn.display();
					}
					this.spinnerHide();
				},
				error => console.log( error )
			);
		}
	}

	spinnerShow()
	{
		this._spinner.show();
		return this;
	}
	spinnerHide()
	{
		this._spinner.hide();
		return this;
	}
}
customElements.define( "nv-feed", NVFeed );




class NVGallery extends NVRepeat
{
	constructor () { super(); }

	connectedCallback ()
	{
		super.connectedCallback();
	}
}
customElements.define( "nv-gallery", NVGallery );



class NVGallerySlider extends NVRepeat
{
	constructor () {
		super();
	}
	connectedCallback ()
	{
		super.connectedCallback();
		
		setTimeout ( () =>
		{
			const slider_feed = this.feed;
			const items = this._feed.children;
			const controls_wrapper = createNode("div", "slider-controls");

			let prev = createNode( "a", ["slider-prev", "nvicon", "nvicon-arrow-left"] )
			.on( "click", this.galleryPrev );

			let next = createNode( "a", ["slider-next", "nvicon", "nvicon-arrow-right"])
				.on( "click", this.galleryNext );

			controls_wrapper.insert( next );
			controls_wrapper.insert( prev );

			this.insert( controls_wrapper ); 
		}, 5 );
	}
	galleryPrev ()
	{
		for ( let i = 0; i < items.length; i++ )
		{
			if ( slider_feed.scrollLeft > items[i].offsetLeft ) 
			{
				slider_feed.scrollBy( {
					left: -500,
					top: 0,
					behavior: "smooth"
				} );
				break;
			}
		}
		return this;
	}
	galleryNext ()
	{
		for ( let i = 0; i < items.length; i++ )
		{
			if ( slider_feed.scrollLeft < items[i].offsetLeft ) 
			{
				slider_feed.scrollBy( {
					left: 500,
					top: 0,
					behavior: "smooth"
				} );
				break;
			}
		}
		return this;
	}
}
customElements.define( "nv-gallery-slider", NVGallerySlider );



class NVItems extends NVElement { constructor() { super(); } connectedCallback() { super.connectedCallback(); } }
customElements.define( "nv-items", NVItems );
class NVItem extends NVElement { constructor() { super(); } connectedCallback() { super.connectedCallback(); } }
customElements.define( "nv-item", NVItem );
class NVFeedItem extends NVElement { constructor() { super(); } connectedCallback() { super.connectedCallback(); } }
customElements.define( "nv-feed-item", NVFeedItem );
class NVGalleryItem extends NVElement { constructor() { super(); } connectedCallback() { super.connectedCallback(); } }
customElements.define( "nv-gallery-item", NVGalleryItem );



/*

						MESSAGEBOX 

*/


class NVMessageBox extends NVElement
{
	constructor () { super(); }

	connectedCallback() {
		setTimeout(()=>
		{
			// to access messagebox from nv-feed
			if ( this.parentElement.nodeName === "NV-FEED" ) this.parentElement.messagebox = this;
			// to access from global nv object
			if ( this.attr("id") ) window.nv.messagebox[ this.attr["id"] ] = this;

		}, 5 );
	}

	addMessage ( message, type = "info", icon = "" )
	{
		if ( icon !== "" ) icon = "<nv-icon class='nvicon-"+icon+"'></nv-icon>";
		this.insert( createNode( "div", [ "message", type ] ).html( icon + message ) );
		return this;
	}
	showMessage ( message, type = "info", icon = "" )
	{
		this.clearMessages();
		this.addMessage( message, type, icon );
		return this;
	}
	clearMessages ()
	{
		this.q( ".message" ).remove();
		return this;
	}
}
customElements.define( "nv-messagebox", NVMessageBox );
window.nv.messagebox = {};





/*

						BUTTON 

*/


class NVButton extends NVElement
{
	constructor ()
	{
		super();
		this.tabindex = 0;
	}
	connectedCallback ()
	{
		super.connectedCallback();
		if ( this.attr("href") )
		{

		}
	}
}
customElements.define( "nv-button", NVButton );





/*

						LOGGED IN / OUT CONDITIONAL 

*/




window.nv.logged = ( document.cookie.indexOf("wp-settings-time") !== -1 );
class NVLoggedIn extends NVElement
{
	constructor () { super(); }
	connectedCallback ()
	{
		super.connectedCallback();
		if ( ! nv.logged ) this.remove();
	}
}
class NVLoggedOut extends NVElement
{
	constructor () { super(); }
	connectedCallback ()
	{
		super.connectedCallback();
		if ( nv.logged ) this.remove();
	}
}
customElements.define( "nv-logged-in", NVLoggedIn );
customElements.define( "nv-logged-out", NVLoggedOut );