/*
// DATA MODEL EXAMPLE
  data = [
    {
        "content": "kmfglknsfbkngmñbk",
        "id": "01",
        "mediaType": "video",
        "mediaUrl": "https://www.youtube.com/watch?v=kZOJCVvyF-4",
        "tags": "#LeaVerou,#CSSVariables,#css,#css2017,#cssConf,#CSSConfAsia2016",
        "title": "Lea Verou: CSS Variables"
    }
  ];
*/

var $ = {};

/**
 * getYouTubeVideoId
 *
 * @param {string} youTubeUrl
 * @return {string} a string that contains a youtube video ID
 */
$.getYouTubeVideoId = (youTubeUrl) => {
    var ytUrl = youTubeUrl || false;
    var ytvId = ytUrl.split('/').pop();
    var isCleanId = (ytvId.indexOf('=') <= 0) ? true : false;
    if ( !isCleanId ) {
      ytvId = ytUrl.split('=').pop();
    }
    return ytvId;
};

/**
 * filterMediaByType
 *
 * @param {string} type Type of th media data recieved
 * @param {string} url Full path of media data recived
 * @return {boolean} false
 */
$.filterMediaByType = ( type, url ) => {
    var media = 'vacio';
    switch(type){
        case 'ytVideo':
            media = `
                <iframe class="postMedia mediaTypeYtvideo" src="https://www.youtube.com/embed/${$.getYouTubeVideoId(url)}" frameborder="0" allowfullscreen></iframe>
            `;
            break;
        case 'img':
            media = `<img class="postMedia mediaTypeImage" src="${url}" />`;
            break;
        default:
        console.log('no se que paso');
        break;
    }
    return media;
};

/**
 * createtemplate
 *
 * @param {string} el Html element, getting by ID
 * @param {string} data data provided by Firebase service
 */
$.createtemplate = (el, data) => {
  var temp = '';
  data.forEach(  (item) =>  {
    let wrapper = $.createPostContainer(item);
    wrapper.innerHTML = $.createPost(item);
    el.prepend(wrapper);
  })
  return false;
};

/**
 * createPost
 *
 * @param {Object} item Recive a string whith the post taglist separated by comms
 * @return {DOM element}
 */
$.createPostContainer = (item) => {
  let postFullPath = `#!/postId/${item.id}/postTitle/${item.title.split(' ').join('-')}`;
  let wrapper = document.createElement('article');
  wrapper.setAttribute( "class", "post" );
  wrapper.setAttribute( "id", postFullPath );
  wrapper.setAttribute( "tags", ( item.tags + "," + postFullPath ) );
  return wrapper;
};

/**
 * createPost
 *
 * @param {Object} item Recive a string whith the post taglist separated by comms
 * @return {string}
 */
$.createPost = (item) => {
  let postString = "<div><h1> Ha ocurrido un error en $.create post</h1></div>";
  postString =`
    <h2 class="postTitle">
      <a href="#!/postId/${item.id}/postTitle/${item.title.split(' ').join('-')}">
        ${item.title}
      </a>
      <buttom id="post-${item.id}" class="isFavoritePost" isFavorite="false">
        #❤
      </buttom>
    </h2>
    <div class="postTags">${$.createTagList(item.tags)}</div>
    <div class="postContainer">
      <div class="postMediaContainer">
        ${$.filterMediaByType( item.mediaType, item.mediaUrl )}
      </div>
      <p class="postContent">${item.content}</p>
    </div>
    `;
  return postString;
};

/**
 * createTagList
 *
 * @param {string} tags Recive a string whith the post taglist separated by comms
 * @return {string} a string of a dom anchor ( <a></a>) element list
 */
$.createTagList = (tags) => {
    var taglist = tags.split(',');
    var finalTag = '';
    taglist.forEach( ( tag ) => {
        var singleTagElement = `
            <a class="tagElement" href="${tag}">${tag}</a>
        `;
        finalTag = finalTag + singleTagElement;
    })
    return finalTag;
}

/**
 * hidePostBySelectedTag
 *
 * @param {string} classNameOftargetElement
 * @param {string} classNameToAdd
 * @param {string} selectedTag
 * @return {boolean} false
 */
$.hidePostBySelectedTag = (classNameOftargetElement, classNameToAdd, selectedTag) => {
  var elementList = document.getElementsByClassName(classNameOftargetElement);
  var selectedTag = selectedTag || location.hash;
  for (i = 0; i < elementList.length; i++){
    var item = elementList[i];
    if ( selectedTag === "" || selectedTag === '#home' ) {
      item.classList.remove(classNameToAdd);
    } else {
      var hasTag = ( !(item.getAttribute('tags').split(',').indexOf(selectedTag) >= 0) ) ? item.classList.add(classNameToAdd) : item.classList.remove(classNameToAdd);
    }
  }
  return false;
}

$.toggleFavorite = (e) => {
  var target = e.srcElement || e.target;
	var element = document.getElementById(target.id);
	var der = element.getAttributeNode('isfavorite');

	debugger;
	return element;
};

$.locationHashChanged = () => {
  $.hidePostBySelectedTag('post', 'hide', location.hash);
}
window.onhashchange = $.locationHashChanged;

var el = document.getElementsByClassName('isFavoritePost');

function toggleFavorite(e) {
  var target = e.srcElement || e.target;

  /**
   ***** Is Favorite Buttom *****
   */
  var element = document.getElementById(target.id);
  var actualIsFavoriteAttributes = element.getAttributeNode('isfavorite');
  var att = document.createAttribute('isfavorite');
  if(actualIsFavoriteAttributes.value === "true"){
    att.value = "false";
  } else {
    att.value = "true";
  }
  element.setAttributeNode(att);

  /**
   ****** Parent Article *******
   */
  var parentArticle = element.parentElement.parentElement;
  var actualTagsAttributesOfParentArticle = parentArticle.getAttributeNode('tags');
  var acttualArticleTagsArray = actualTagsAttributesOfParentArticle.value.split(',');
  if(acttualArticleTagsArray[acttualArticleTagsArray.length - 1] === "#❤"){
    acttualArticleTagsArray.pop()
  } else {
    acttualArticleTagsArray.push("#❤");
  }
  var newParentArticleTagsAttributes = document.createAttribute('tags');
  newParentArticleTagsAttributes.value = acttualArticleTagsArray.join();
  parentArticle.setAttributeNode(newParentArticleTagsAttributes);
}

for(var i=0; i <= ( el.length -1 ); i++){
	console.log(i)
	el[i].addEventListener("click", toggleFavorite, false);
}
