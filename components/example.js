<body>
    <div class="wrapper">
        <button class="like-btn">
            <span class="like-text">点赞</span>
            <span>OK</span>
        </button>
    </div>
</body>


const button = document.querySelector('.like-btn')
const buttonText = button.querySelector('.like-text')
let isLiked = false
button.addEventListener('click', () => {
    isLiked = !isLiked
    if (isLiked) {
        buttonText.innerHTML = '取消'
    } else {
        buttonText.innerHTML = '点赞'
    }
}, false)