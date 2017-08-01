/*
// DATA MODEL EXAMPLE
  data = [
    {
        "content": "kmfglknsfbkngmñbk",
        "id": "01",
        "mediaType": "video",
        "mediaUrl": "https://www.youtube.com/watch?v=IRI1H5tyEAo",
        "tags": "#css,#css2017,#cssConf",
        "title": "primer post post ta"
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
  data.forEach(  (x) =>  {
    let  wrapper = document.createElement('article');
    wrapper.setAttribute("class", "post");
    wrapper.setAttribute("tags", x.tags);
    wrapper.innerHTML = `
      <h2 class="postTitle">${x.title}</h2>
      <div class="postTags">${$.createTagList(x.tags)}</div>
      <div class="postContainer">
        <p class="postContent">${x.content}</p>
        <div class="postMediaContainer">
          ${$.filterMediaByType( x.mediaType, x.mediaUrl )}
        </div>
      </div>
      `;
    el.prepend(wrapper);
  })
  return false;
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
$.locationHashChanged = () => {
  $.hidePostBySelectedTag('post', 'hide', location.hash);
}
window.onhashchange = $.locationHashChanged;
