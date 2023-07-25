// Select the DOM-element, so that you can replace it with content
let PROJECT_ID = "mih1agps";
let DATASET = "production";
let QUERY = encodeURIComponent('*[_type == "post"]');
let text = document.getElementById("text");

let titlePost = document.getElementById("title-post");
let subtitlePost = document.getElementById("subtitle-post");
let thumbnailPost = document.getElementById("thumbnail-post");
let postList = document.getElementById("postList");
let postListItem = document.getElementById("postListItem");

// Function to encode URI component
function encodeParam(param) {
  return encodeURIComponent(param);
}

// fetch the content
fetch(
  `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`
)
  .then((res) => res.json())
  .then(({ result }) => {
    //let list = document.querySelector("ul");
    let list = postList;
    //let list = document.getElementById("post-list")
    //let firstListItem = document.querySelector("ul li");
    let firstListItem = postListItem;
    //let firstListItem = document.getElementById("post__list-item");

    if (result.length > 0) {
      // remove the placeholder content
      list.removeChild(firstListItem);

      result.forEach((post) => {
        let listItem = document.createElement("li");

        listItem.className = "post__list-item";
        //let listItem = firstListItem

        // Use the 'name' property as the title
        //let title = post.name || "No Title";
        //let subtitle = "";
        titlePost = post.name || "No Title";
        subtitlePost = "";

        titlePost.className = "title-post";
        subtitlePost.className = "subtittle-post";

        // Extract the first text from the content as the subtitle
        const children = post?.content || [];
        for (const child of children) {
          if (
            child._type === "block" &&
            child.children &&
            child.children[0]?.text
          ) {
            subtitlePost = child.children[0].text;
            break;
          }
        }

        // Set the title and subtitle for the list item
        listItem.innerHTML = `
          <h1>${titlePost}</h1>
          <p>${subtitlePost}</p>
        `;

        // Extract the first image from the content
        firstImageSrc = "";
        for (const child of children) {
          if (child._type === "image" && child.asset?._ref) {
            // Extract the image filename from the _ref property
            let imageRef = child.asset._ref;
            if (imageRef.includes("image-")) {
              imageRef = imageRef.replace("image-", "").replace("-jpg", ".jpg");
              firstImageSrc = `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${imageRef}`;
              break;
            }
          }
        }

        // Create an <img> element for the thumbnail
        //let thumbnailImg = document.createElement("img");
        let thumbnailImg = document.createElement("img");
        thumbnailImg.src = firstImageSrc;

        thumbnailImg.className = "thumbnail-post";

        // thumbnailImg.className = "post__img-thumbnail";
        // You can add additional attributes, styles, and classes to the thumbnail image if needed
        // thumbnailImg.alt = "Alternative Text";
        //thumbnailImg.style.width = "300px";
        //thumbnailImg.style.height = "300px";

        // Append the thumbnail <img> element to the list item
        listItem.appendChild(thumbnailImg);

        // Add a click event listener to the list item
        listItem.addEventListener("click", () => {
          // Encode the post data and send it as a query parameter to detail.html
          const postDataQueryParam = encodeParam(JSON.stringify(post));
          window.location.href = `detail.html?data=${postDataQueryParam}`;
        });

        // Add the item to the list
        list.appendChild(listItem);
      });
    }
  })
  .catch((err) => console.error(err));
