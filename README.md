<h1>TRENDIK</h1>
<h3>우린 스타일을 새롭게 쉐어해.</h3>
<h4>패션에 고관여된 고객들이 자유롭게 소통하고 콘텐츠를 공유하는 공간인 패션 스타일로그</h4>
<h4>⭐️ 서비스 배포 링크 : 트렌딕 (https://trendik.shop)</h4>
<br />
<img src="https://github.com/KIMYOUNGWOON/TRENDIK/assets/126956430/cfd3bc94-541f-413e-a6d1-41b3174956bf">
<br />
<br />
<br />
<h2>📍 프로젝트 소개</h2>
<ul>
  <li>인원 : 개인 프로젝트 (1명)</li>
  <li>역할 : 풀스택 (기여도 100%)</li>
  <li>사용 스킬 : React / TypeScript / Prettier / Eslint / GIt / Git Hub </li>
  <li>스타일 : styled-components</li>
  <li>데이터베이스 : Firebase</li>
  <li>클라이언트 상태 관리 : React Context API</li>
  <li>서버 상태 관리 : TanStack Query</li>
  <li>빌드 툴 : vite</li>
  <li>배포 자동화 : GitHub Actions / Amazon S3 / Cloud Front</li>
</ul>
<br>
<h2>📍 프로젝트 시작 전 작업</h2>
<h3>와이어 프레임 작성</h3>
<div>• 모바일 앱과 유사한 레이아웃 설계</div>
<br>
<img src="https://github.com/KIMYOUNGWOON/TRENDIK/assets/126956430/e8c10a26-1ae1-4aca-8204-d9c9df76020c">
<br />
<br />
<br />
<h2>📍 구현 내용</h2>
<h3>✓ 페이지 라우팅 설계</h3>
<div>• React router를 사용해 Public(비로그인)과 Private(로그인) 클라이언트 페이지 설계</div>
<br />
<h3>✓ 회원가입/로그인</h3>
<img width=410 src="https://github.com/KIMYOUNGWOON/TRENDIK/assets/126956430/313fd3ae-3b55-48d9-b711-cc1d30fc1572"> 
<img width=410 src="https://github.com/KIMYOUNGWOON/TRENDIK/assets/126956430/6cfc45e2-6a1b-4be2-851a-e7b54f3c4cd1">
<br />
<br />
<details>
  <summary>Users Collection 스키마</summary>
  <table>
    <tr>
      <th>Key</th>
      <th>Type</th>
    </tr>
    <tr>
      <td>userId</td>
      <td>string</td>
    </tr>
    <tr>
      <td>name</td>
      <td>string</td>
    </tr>
    <tr>
      <td>nickName</td>
      <td>string</td>
    </tr>
    <tr>
      <td>email</td>
      <td>string</td>
    </tr>
    <tr>
      <td>gender</td>
      <td>string</td>
    </tr>
    <tr>
      <td>height</td>
      <td>string</td>
    </tr>
    <tr>
      <td>weight</td>
      <td>string</td>
    </tr>
    <tr>
      <td>sheosSize</td>
      <td>string</td>
    </tr>
    <tr>
      <td>profileImaga</td>
      <td>string</td>
    </tr>
    <tr>
      <td>coverImage</td>
      <td>string</td>
    </tr>
    <tr>
      <td>createdAt</td>
      <td>Date</td>
    </tr>
    <tr>
      <td>updatedAt</td>
      <td>Date</td>
    </tr>
  </table>
</details>
<details>
  <summary>구현 내용</summary>
  <ul>
    <li>
      <div>회원가입 기능을 통해 사용자는 계정을 생성할 수 있다.</div>
      <ul>
        <li>Firebase Authentication을 이용해 이메일/비밀번호 인증을 통한 회원가입 기능 구현</li>
        <li>회원가입 필수 요소: 이메일, 비밀번호, 이름, 닉네임, 성별, 키, 몸무게, 신발사이즈</li>
        <li>필수 요소를 전부 기입해야 회원가입 버튼 활성화</li>
      </ul>
    </li>
    <li>
      <div>로그인 및 로그아웃 기능을 통해 사용자는 편리하게 서비스 이용할 수 있다.</div>
      <ul>
        <li>Firebase Authentication을 활용한 이메일/비밀번호 로그인 기능 구현</li>
        <li>signOut 메소드를 이용해 로그아웃 기능 구현</li>
      </ul>
    </li>
  </ul>
</details>
<details>
  <summary>유효성 검사</summary>
  <ul>
    <li>이메일은 문자, 숫자, 점, 대시, 밑줄로 시작, '@' 기호 뒤에 문자, 숫자, 점, 대시로 이루어진 문자열, 점 뒤에 2~4개의 알파벳 </li>
    <li>비밀번호는 최소 8자 이상, 최소한 하나의 영문자, 숫자, 특수 문자를 포함</li>
    <li>닉네임은 소문자 알파벳, 숫자, 밑줄(_)로 이루어진 5자 이상의 문자열</li>
    <li>유효성 검사가 전부 통과되어야 회원가입 버튼 활성화</li>
  </ul>
</details>
<details>
  <summary>사용자 경험 향상</summary>
  <ul>
    <li>
      <div>이메일 중복 체크</div>
      <ul>
        <li>모든 정보를 입력한 후에야 중복된 이메일임을 알게 되는 불편함을 줄이기 위해 이메일 입력 부분에서 중복 체크</li>
      </ul>
    </li>
    <li>
      <div>실시간 비밀번호 유효성 검사</div>
      <ul>
        <li>비밀번호 입력 시, 유효성 규칙을 목록으로 보여주고, 사용자가 비밀번호를 입력할 때마다 해당 규칙이 충족되는지 실시간으로 체크</li>
      </ul>
    </li>
    <li>
      <div>비밀번호 가시성 토글 기능</div>
      <ul>
        <li>비밀번호 입력 필드 옆에 '보기' 아이콘을 추가하여, 사용자가 클릭하면 가려진 비밀번호를 볼 수 있게 함</li>
      </ul>
    </li>
    <li>
      <div>닉네임 중복 체크</div>
      <ul>
        <li>모든 정보를 입력한 후에야 중복된 닉네임임을 알게 되는 불편함을 줄이기 위해 닉네임 입력 부분에서 중복 체크</li>
      </ul>
    </li>
    <li>
      <div>로딩중 처리</div>
      <ul>
        <li>사용자의 불필요한 추가 요청 방지를 위해 버튼 클릭 이후 응답을 기다리는 동안 로딩 스피너 표시</li>
      </ul>
    </li>
  </ul>
</details>
<br>
<h3>✓ 사용자 정보</h3>
<img width=410 src="https://github.com/KIMYOUNGWOON/TRENDIK/assets/126956430/0d7629f3-4dc7-4b46-a66b-f901f7100c48">
<img width=410 src="https://github.com/KIMYOUNGWOON/TRENDIK/assets/126956430/5125c4b7-94b3-4954-8bc9-f945ba2f327b">
<br>
<br>
<details>
  <summary>구현 내용</summary>
  <ul>
    <li>
      <div>계정 정보 관리</div>
      <ul>
        <li>이름 변경 기능 : 회원가입 시 입력한 이름을 변경할 수 있음</li>
        <li>비밀번호 변경 기능 : Firebase Authentication을 활용해 비밀번호를 변경할 수 있음</li>
        <li>회원 탈퇴 기능 : 사용자가 회원 탈퇴를 통해 자신의 모든 정보를 삭제할 수 있음</li>
      </ul>
    </li>
    <li>
      <div>프로필 관리</div>
      <ul>
        <li>이미지 변경 : 프로필 및 커버 이미지를 동시에 혹은 개별적으로 변경할 수 있음</li>
        <li>이미지 초기화 : 프로필 이미자와 커버이미지를 초기화하여 기본 상태로 복원 가능</li>
        <li>스토리지 용량 관리 : Firebase Storage의 주소를 사용하여 이미지 업데이트 시 이전 이미지를 덮어쓰도록 설정</li>
        <li>개인 정보 변경 : 닉네임, 성별, 키, 몸무게, 신발사이즈, 소개 등을 변경할 수 있음</li>
        <li>닉네임 중복 확인 : 닉네임은 중복될 수 없으며, 중복 검사 후 변경이 가능하도록 함</li>
      </ul>
    </li>
  </ul>
</details>
<details>
  <summary>사용자 경험 향상</summary>
  <ul>
    <li>
      <div>옵티미스틱 업데이트 📌 <a href="https://github.com/KIMYOUNGWOON/TRENDIK/blob/main/src/pages/ProfileEdit/components/ProfileEditModal.tsx#L67">[코드 보러가기]</a></div>
      <ul>
        <li>즉각적 UI 반영: 사용자가 이름, 닉네임, 성별, 키, 몸무게, 신발사이즈, 소개 등의 정보를 업데이트할 때 서버 응답을 기다리지 않고 바로 UI에 변경사항 반영</li>
        <li>useMutation 활용: 서버로부터의 응답 대신 클라이언트 상에 즉각적인 업데이트를 적용하여 사용자 경험 개선</li>
        <li>롤백 메커니즘: 업데이트 실패 시, 변경 전 상태로 자동으로 되돌리는 기능을 통해 데이터 일관성 유지</li>
      </ul>
    </li>
    <li>
      <div>로딩중 처리</div>
      <ul>
        <li>프로필과 커버 이미지 변경 등의 처리 중에는 로딩스피너를 표시하여 처리 중임을 명확히 알림</li>
      </ul>
    </li>
    <li>
      <div>모달 팝업 활용</div>
      <ul>
        <li>모든 정보 변경 시 모달 팝업을 슬라이드 형태로 나타나게 함으로써 모바일 앱과 같은 경험 제공</li>
      </ul>
    </li>
  </ul>
</details>
<br>
<h3>✓ 유저 조회/검색</h3>
<img width=410 src="https://github.com/KIMYOUNGWOON/TRENDIK/assets/126956430/c8eb9dc3-b43d-43f0-a511-76bf072b8680">
<br>
<br>
<details>
  <summary>구현 내용</summary>
  <ul>
    <li>
      <div>유저 조회</div>
      <ul>
        <li>"사용자 둘러보기" 페이지에 들어가면 다른 사용자들의 프로필을 카드 형태의 리스트로 보여줌</li>
        <li>사용자가 리스트 중 프로필 이미지나 닉네임을 클릭하면, 그 사용자의 마이페이지로 이동</li>
      </ul>
    </li>
    <li>
      <div>유저 검색</div>
      <ul>
        <li>사용자가 검색창에 특정 유저의 닉네임을 입력하면, 검색 결과로 기존 카드 리스트 업데이트</li>
        <li>사용자가 검색창에 입력할 때, race condition을 방지하고 API 요청을 줄이기 위해 debounce 기법 적용</li>
      </ul>
    </li>
  </ul>
</details>
<details>
  <summary>사용자 경험 향상</summary>
  <ul>
    <li>
      <div>스켈레톤 UI 도입</div>
      <ul>
        <li>컴포넌트가 마운트될 때, 팔로우 상태 데이터를 서버로부터 불러오는 과정에서 발생하던 UI 깜빡임 현상(플리커링)을 제거하여 부드러운 사용자 경험 제공</li>
        <li>유저 리스트를 불러올 때, 프로필 이미지 유무에 따른 렌더링 불일치 문제도 해결하여 통일된 인터페이스 제공</li>
      </ul>
    </li>
  </ul>
</details>
<br>
<h3>✓ 팔로우/팔로잉</h3>
<img width=410 src="https://github.com/KIMYOUNGWOON/TRENDIK/assets/126956430/587cf459-0952-43c1-8394-41d1372d8a00">
<img width=410 src="https://github.com/KIMYOUNGWOON/TRENDIK/assets/126956430/d883f9ba-d522-47d4-8f50-267048a08a42">
<br>
<br>
<details>
  <summary>Follows Collection 스키마</summary>
  <table>
    <tr>
      <th>Key</th>
      <th>Type</th>
    </tr>
    <tr>
      <td>followerId</td>
      <td>string</td>
    </tr>
    <tr>
      <td>followingId</td>
      <td>string</td>
    </tr>
    <tr>
      <td>createdAt</td>
      <td>Date</td>
    </tr>
  </table>
</details>
<details>
  <summary>구현 내용</summary>
  <ul>
    <li>
      <div>사용자 또는 다른 사용자의 마이페이지에서 팔로우/팔로잉 정보를 볼 수 있고 관계를 수정 할 수 있다.</div>
      <ul>
        <li>팔로우/팔로잉 수 표시</li>
        <li>팔로우/팔로잉 유저 리스트</li>
        <li>팔로우/팔로잉 관계 수정</li>
      </ul>
    </li>
    <li>
      <div>팔로우/팔로잉 리스트 페이지에서 정렬 및 검색을 통해 사용자를 빠르게 찾을 수 있다.</div>
      <ul>
        <li>팔로우한 날짜 기준으로 유저 리스트를 오래된 순, 최근 순으로 정렬할 수 있는 기능 제공</li>
        <li>페이지 상단의 검색창을 통해 닉네임을 이용하여 팔로우/팔로잉 유저를 찾을 수 있음</li>
        <li>검색 기능의 경우 디바운스 기법을 적용해 불필요한 API 요청을 줄임</li>
      </ul>
    </li>
  </ul>
</details>
<details>
  <summary>사용자 경험 향상</summary>
  <ul>
    <li>
      <div>옵티미스틱 업데이트와 디바운스 접목</div>
      <ul>
        <li>관계 수정 시 즉각적인 반응을 보여주기 위해 옵티미스틱 업데이트</li>
        <li>빠르게 연속적으로 버튼을 클릭하면 서버와 클라이언트의 상태가 달라져 UI 플리커링 발생</li>
        <li>디바운스 기법을 접목하여, UI는 즉시 반영되면서도 서버에 대한 불필요한 요청은 줄임</li>
      </ul>
    </li>
    <li>
      <div>스켈레톤 UI 도입</div>
      <ul>
        <li>팔로우 상태를 불러올 때 렌더링 된 후 서버 상태 값으로 UI가 바뀜</li>
        <li>서버 상태가 완전히 적용되기 전에 스켈레톤 UI를 보여줌</li>
        <li>동시에 상태가 업데이트되어 일관된 사용자 경험 보장</li>
      </ul>
    </li>
  </ul>
</details>
📌 <a href="https://github.com/KIMYOUNGWOON/TRENDIK/blob/main/src/api/connectApi.ts">[팔로우 관련 API]</a>
<br>
<br>
<br>
<h3>✓ 게시글 CRUD</h3>
<img width=410 src="https://github.com/KIMYOUNGWOON/TRENDIK/assets/126956430/7e178eba-f3f6-487a-97af-3cadddec8d73">
<img width=410 src="https://github.com/KIMYOUNGWOON/TRENDIK/assets/126956430/137fe3b4-01c9-412f-9149-27a2178bc411">
<br>
<br>
<details>
  <summary>Feeds Collection 스키마</summary>
  <table>
    <tr>
      <th>Key</th>
      <th>Type</th>
    </tr>
    <tr>
      <td>id</td>
      <td>string</td>
    </tr>
    <tr>
      <td>userId</td>
      <td>string</td>
    </tr>
    <tr>
      <td>feedImages</td>
      <td>string[]</td>
    </tr>
    <tr>
      <td>content</td>
      <td>string</td>
    </tr>
    <tr>
      <td>hashTag</td>
      <td>string[]</td>
    </tr>
    <tr>
      <td>outer</td>
      <td>string</td>
    </tr>
    <tr>
      <td>top</td>
      <td>string</td>
    </tr>
    <tr>
      <td>bottom</td>
      <td>string</td>
    </tr>
    <tr>
      <td>shoes</td>
      <td>string</td>
    </tr>
    <tr>
      <td>gender</td>
      <td>string</td>
    </tr>
    <tr>
      <td>style</td>
      <td>string</td>
    </tr>
    <tr>
      <td>likeCount</td>
      <td>number</td>
    </tr>
    <tr>
      <td>commentCount</td>
      <td>number</td>
    </tr>
    <tr>
      <td>commentActive</td>
      <td>boolean</td>
    </tr>
    <tr>
      <td>createdAt</td>
      <td>Date</td>
    </tr>
    <tr>
      <td>updatedAt</td>
      <td>Date</td>
    </tr>
  </table>
</details>
<details>
  <summary>게시글 조회</summary>
  <ul>
    <li>
      <div>구현 내용</div>
      <ul>
        <li>메인 페이지에서 모든 사용자의 게시글 전체 조회</li>
        <li>각 사용자 마이페이지에서 해당 사용자의 게시글 조회</li>
        <li>게시글은 최신순으로 정렬</li>
      </ul>
    </li>
    <li>
      <div>렌더링 최적화</div>
      <ul>
        <li>useInView, useInfiniteQuery 이 두가지를 이용해서 무한 스크롤 구현</li>
        <li>스크롤 위치가 페이지 하단에 도달했을 때 추가 데이터를 불러옴</li>
        <li>다음 데이터를 불러오는 동안 로딩스피너 표시</li>
        <li>전체 게시물 조회 시 8개씩 페이징 처리</li>
      </ul>
    </li>
    <li>
      <div>사용자 경험 향상</div>
      <ul>
        <li>UI 플리커링 현상을 막기 위해 스켈레톤 UI 도입</li>
        <li>게시물이 로드되는 동안 대략적인 페이지의 레이아웃을 미리 보여줌</li>
      </ul>
    </li>
  </ul>
</details>
<details>
  <summary>게시글 생성</summary>
  <ul>
    <li>
      <div>구현 내용</div>
      <ul>
        <li>게시글 생성 필수 요소 : 이미지, 해시태그, 게시글, 착용 브랜드, 성별, 스타일</li>
        <li>이미지는 최대 3개까지 업로드 가능하며, 3개 초과 시 알림 경고 표시</li>
        <li>react-beautiful-dnd 라이브러리 활용하여 이미지 노출 순서를 드래그로 변경할 수 있도록 구현</li>
        <li>필수 요소가 전부 입력되어야 업로드 버튼 활성화</li>
      </ul>
    </li>
    <li>
      <div>렌더링 최적화</div>
      <ul>
        <li>react-image-file-resizer 라이브러리 활용</li>
        <li>이미지를 업로드할 때 리사이징하여 파이어베이스 스토리지에 저장</li>
        <li>이미지 파일의 크기를 최적 품질을 유지하며 40~50KB 이하로 줄여 전체적인 페이지 성능 향상</li>
      </ul>
    </li>
  </ul>
</details>
<details>
  <summary>게시글 수정/삭제</summary>
  <ul>
    <li>
      <div>구현 내용</div>
      <ul>
        <li>본인이 등록한 게시물만 수정/삭제가 가능</li>
        <li>게시글 생성 필수 요소 전부 수정 가능</li>
      </ul>
    </li>
    <li>
      <div>데이터베이스 관리</div>
      <ul>
        <li>게시물 수정 시 새로운 이미지를 업로드하면, 기존에 저장된 이미지는 Storage에서 자동으로 삭제되도록 처리</li>
        <li>이를 통해 Storage 관리를 최적화하고 이미지 중복을 방지함</li>
        <li>게시물 삭제 시 찜, 좋아요, 댓글, 대댓글과 같은 연관된 참조 데이터를 Firestore에서 전부 삭제</li>
      </ul>
    </li>
  </ul>
</details>
📌 <a href="https://github.com/KIMYOUNGWOON/TRENDIK/blob/main/src/api/postApi.ts">[게시물 관련 API]</a>
<br>
<br>
<br>
<h3>✓ 댓글 CRUD</h3>
<img width=410 src="https://github.com/KIMYOUNGWOON/TRENDIK/assets/126956430/5ca896a2-1d74-40be-a564-22ee7f8b4d99">
<img width=410 src="https://github.com/KIMYOUNGWOON/TRENDIK/assets/126956430/893c25a9-27cf-4ff9-814f-ba5270622852">
<br>
<br>
<details>
  <summary>Comments Collection 스키마</summary>
  <table>
    <tr>
      <th>Key</th>
      <th>Type</th>
    </tr>
    <tr>
      <td>id</td>
      <td>string</td>
    </tr>
    <tr>
      <td>userId</td>
      <td>string</td>
    </tr>
    <tr>
      <td>feedId</td>
      <td>string</td>
    </tr>
    <tr>
      <td>userInfo</td>
      <td>DocumentData</td>
    </tr>
    <tr>
      <td>comment?</td>
      <td>string</td>
    </tr>
    <tr>
      <td>gif?</td>
      <td>string</td>
    </tr>
    <tr>
      <td>type</td>
      <td>string</td>
    </tr>
    <tr>
      <td>likeCount</td>
      <td>number</td>
    </tr>
    <tr>
      <td>fresh</td>
      <td>boolean</td>
    </tr>
    <tr>
      <td>createdAt</td>
      <td>Date</td>
    </tr>
    <tr>
      <td>updatedAt</td>
      <td>Date</td>
    </tr>
  </table>
</details>
<details>
  <summary>댓글 생성</summary>
  <ul>
    <li>
      <div>구현 내용</div>
      <ul>
        <li>사용자는 텍스트 형태로 댓글을 작성할 수 있음</li>
        <li>사용자는 Gif 파일을 댓글에 첨부하여 동적인 표현을 할 수 있음</li>
      </ul>
    </li>
    <li>
      <div>사용자 경험 향상</div>
      <ul>
        <li>방금 사용자가 작성한 댓글이 어떤 것인지 명확히 인식할 수 있도록 해당 댓글의 배경을 잠시 연노랑으로 강조하여 표시</li>
        <li>댓글이 생성될 때마다 스크롤이 최상단으로 올라가며, 맨 위에는 최신 댓글이 표시</li>
        <li>옵티미스틱 업데이트를 적용하여 즉각적으로 댓글 표시</li>
      </ul>
    </li>
  </ul>
</details>
<details>
  <summary>댓글 조회</summary>
  <ul>
    <li>
      <div>구현 내용</div>
      <ul>
        <li>사용자가 댓글을 조회할 때, 댓글들이 최신 순으로 정렬되어 표시</li>
        <li>useInView, useInfiniteQuery 이 두가지를 이용해서 무한 스크롤 구현</li>
        <li>첫 페이지 로딩 시, 최초 16개의 댓글만 로드</li>
        <li>스크롤 위치가 페이지 하단에 도달했을 때 추가 데이터를 불러옴</li>
        <li>다음 데이터를 불러오는 동안 로딩스피너 표시</li>
      </ul>
    </li>
  </ul>
</details>
<details>
  <summary>댓글 수정/삭제</summary>
  <ul>
    <li>
      <div>구현 내용</div>
      <ul>
        <li>자신이 작성한 댓글에 대해서는 수정 및 삭제가 가능</li>
        <li>게시물의 작성자는 다른 사용자들이 작성한 댓글을 삭제할 수 있음</li>
        <li>댓글 삭제 시 참조되어 있는 대댓글도 데이터베이스에서 함께 전부 삭제</li>
        <li>댓글 삭제 및 수정의 경우도 옵티미스틱 업데이트를 적용하여 즉각적으로 피드백 전달</li>
      </ul>
    </li>
  </ul>
</details>
<details>
  <summary>대댓글 CRUD</summary>
  <ul>
    <li>
      <div>구현 내용</div>
      <ul>
        <li>사용자는 어떤 댓글에 대해 대댓글을 작성할 수 있음</li>
        <li>대댓글은 원 댓글 바로 아래에 소규모 들여쓰기와 함께 표시</li>
        <li>토글로 대댓글을 펼쳐서 보거나 숨길 수 있도록 구현</li>
        <li>자신이 작성한 대댓글을 수정하거나 삭제할 수 있음</li>
        <li>게시글의 작성자는 대댓글을 포함한 모든 댓글을 필요에 따라 삭제할 수 있음</li>
        <li>대댓글 생성, 수정, 삭제의 경우 옵티미스틱 업데이트를 적용하여 즉각적인 피드백 전달</li>
      </ul>
    </li>
  </ul>
</details>
📌 <a href="https://github.com/KIMYOUNGWOON/TRENDIK/blob/main/src/api/commentApi.ts">[댓글 관련 API]</a>
<br>
<br>
<br>
<h2>📍 트러블 슈팅</h2>
