/* 
    kakaoMap
*/

const lat = document.getElementById("lat").value;
const lng = document.getElementById("lng").value;

var mapContainer = document.getElementById("map2"), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(lat, lng), // 지도의 중심좌표
    draggable: false,
    level: 4, // 지도의 확대 레벨
  };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 마커를 생성합니다
var marker = new kakao.maps.Marker({
  position: markerPosition,
});

var markerPosition = new kakao.maps.LatLng(lat, lng); // 마커가 표시될 위치입니다

// 마커를 생성합니다
var marker = new kakao.maps.Marker({
  position: markerPosition,
});

// 마커가 지도 위에 표시되도록 설정합니다
marker.setMap(map);

const space = document.querySelector("#map2").getAttribute("value");

document.querySelector("#map2").addEventListener("click", function () {
  var center = map.getCenter();

  // 검색어를 포함한 카카오 맵 URL을 생성합니다
  var mapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(
    `${space}`
  )}?map_type=DEFAULT&mapX=${center.getLng()}&mapY=${center.getLat()}&q=${encodeURIComponent(
    `${space}`
  )}`;

  // 새 창에서 카카오 맵을 엽니다
  window.open(mapUrl, "_blank");
});

/* 
    review
*/

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("reviewModal");
  const openModalBtn = document.getElementById("openModalBtn");
  const closeBtn = document.querySelector(".close");
  const stars = document.querySelectorAll(".star");
  const reviewText = document.getElementById("reviewText");
  let selectedRating = 0;

  openModalBtn.addEventListener("click", () => {
    modal.style.display = "block";
    setTimeout(() => {
      modal.querySelector(".modal-content").style.opacity = 1;
    }, 10);
  });

  closeBtn.addEventListener("click", () => {
    modal.querySelector(".modal-content").style.opacity = 0;
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
  });

  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.querySelector(".modal-content").style.opacity = 0;
      setTimeout(() => {
        modal.style.display = "none";
      }, 300);
    }
  });

  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      selectedRating = index + 1;
      updateStarRating();
    });
  });

  function updateStarRating() {
    stars.forEach((star, index) => {
      if (index < selectedRating) {
        star.classList.add("selected");
      } else {
        star.classList.remove("selected");
      }
    });
  }

  const submitReviewBtn = document.getElementById("submitReview");
  submitReviewBtn.addEventListener("click", () => {
    const text = reviewText.value;
    modal.querySelector(".modal-content").style.opacity = 0;
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
  });
});
