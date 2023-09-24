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

var logID = "log",
  log = $('<div id="' + logID + '"></div>');
$("body").append(log);
$('[type*="radio"]').change(function () {
  var me = $(this);
  var selectedValue = parseInt(me.attr("value")); // 'value' 속성을 정수로 변환
  var scoreMapping = {
    0: 10,
    1: 30,
    2: 50,
    3: 70,
    4: 100,
  };
  var score = scoreMapping[selectedValue] || 0; // 선택한 값에 해당하는 점수 가져오기

  log.html(me.attr("value"));
});

/* 해당 메모부분 */

// input 요소와 lbl_limit 요소를 가져옴
const inputElement = document.getElementById("reviewText");
const lblLimit = document.getElementById("lbl_limit");

// input 이벤트를 사용하여 글자 수를 실시간으로 업데이트
inputElement.addEventListener("input", function () {
  const currentCount = inputElement.value.length;

  lblLimit.textContent = currentCount + " / 25";

  if (currentCount >= 25) {
    inputElement.maxLength = 25; // 25자 이상이면 더 이상 입력하지 못하도록 막음
    lblLimit.style.color = "red"; // 또는 다른 스타일을 적용
    lblLimit.innerHTML = "허용 글자를 초과하였습니다.";
  } else {
    inputElement.maxLength = 25; // 10자 미만이면 최대 25자까지 입력 가능
    lblLimit.style.color = ""; // 스타일 초기화 또는 다른 스타일을 적용
  }
});

function previewImage(input) {
  var preview = document.getElementById("preview");
  var imagePreviewDiv = document.getElementById("image-preview");

  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
      imagePreviewDiv.style.display = "flex";
      imagePreviewDiv.style.justifyContent = "center";
    };

    reader.readAsDataURL(input.files[0]);
  } else {
    // preview.style.display = "none";
    // imagePreviewDiv.style.display = "none";
  }
}
