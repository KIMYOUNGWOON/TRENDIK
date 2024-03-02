<h1>TRENDIK</h1>
<h3>우린 스타일을 새롭게 쉐어해</h3>
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
<br />
<h2>📍 프로젝트 시작 전 작업</h2>
<h3>와이어 프레임 작성</h3>
<h4>• 모바일 앱과 유사한 레이아웃 설계</h4>
<img src="https://github.com/KIMYOUNGWOON/TRENDIK/assets/126956430/e8c10a26-1ae1-4aca-8204-d9c9df76020c">
<br />
<br />
<br />
<h2>📍 구현 내용</h2>
<h3>회원가입/로그인</h3>
<img width=410 src="https://github.com/KIMYOUNGWOON/TRENDIK/assets/126956430/313fd3ae-3b55-48d9-b711-cc1d30fc1572"> 
<img width=410 src="https://github.com/KIMYOUNGWOON/TRENDIK/assets/126956430/6cfc45e2-6a1b-4be2-851a-e7b54f3c4cd1">
<br />
<br />
<details>
  <summary>User Collection 스키마</summary>
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
      <div>회원가입 기능을 통해 사용자는 계정을 생성할 수 있습니다.</div>
      <ul>
        <li>Firebase Authentication을 이용해 이메일/비밀번호 인증을 통한 회원가입 기능 구현</li>
        <li>회원가입 필수 요소: 이메일, 비밀번호, 이름, 닉네임, 성별, 키, 몸무게, 신발사이즈</li>
        <li>필수 요소를 전부 기입해야 회원가입 버튼 활성화</li>
      </ul>
    </li>
    <li>
      <div>로그인 및 로그아웃 기능을 통해 사용자는 편리하게 서비스를 이용할 수 있습니다.</div>
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
  </ul>
</details>
<br>
<h3>유저 조회/검색</h3>
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
<h2>📍 트러블 슈팅</h2>
