/* 
            카카오 맵 관련
*/

var mapOptions = {
  center: new naver.maps.LatLng(36.35094516016773, 127.43764801636559),
  zoom: 18,
};
// 포커싱될 마커 객체를 저장하는 변수
var focusingMarker = null;

var map = new naver.maps.Map("map", mapOptions);
// 마커를 생성하고 지도에 표시하는 함수
function createMarker(lat, lng) {
  var markerOptions = {
    position: new naver.maps.LatLng(lat, lng),
    map: map,
    icon: {
      url: "https://sunbodydev.github.io/marker_focusing.png",
      origin: new naver.maps.Point(0, 0),
      anchor: new naver.maps.Point(25, 26),
    },
  };

  var marker = new naver.maps.Marker(markerOptions);
}

// 사이드바에서 목록 항목을 클릭했을 때 해당 마커로 이동

var sidebarItems = document.querySelectorAll(".PoiBlockContainer a");
sidebarItems.forEach(function (item) {
  item.addEventListener("mousemove", function (e) {
    e.preventDefault();
    var lat = parseFloat(item.getAttribute("data-lat"));
    var lng = parseFloat(item.getAttribute("data-lng"));

    // 부드러운 애니메이션 효과를 사용하여 해당 위치로 이동
    map.panTo(new naver.maps.LatLng(lat, lng), {
      animation: naver.maps.Animation.EASE_OUT,
    });
  });
});
// reviewList 배열 예시
var reviewList = [
  { dataLat: 36.35094516016773, dataLng: 127.43764801636559 },
  { dataLat: 36.348305189934436, dataLng: 127.43069856879843 },
  // 다른 항목들...
];

// reviewList 배열을 반복하여 각 항목에 대한 마커 생성
for (var i = 0; i < reviewList.length; i++) {
  var lat = parseFloat(reviewList[i].dataLat);
  var lng = parseFloat(reviewList[i].dataLng);
  createMarker(lat, lng);
}
