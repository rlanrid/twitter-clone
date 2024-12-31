# React를 이용해 Twitter clone사이트 만들기   

## 🔧초기세팅   
**Frontend**   
`npm i vite@latest .`   
`npm i react-router-dom`
`npm i @tanstack/react-query`

**Backend**   
`npm i express mongoose jsonwebtoken bcryptjs dotenv cors cookie-parser cloudinary`   
`npm i -D nodemon`   

## 🧾개념 정리   
- Vite   
웹 애플리케이션을 빠르고 효율적으로 개발할 수 있도록 설계된 현대적인 프론트엔드 개발 도구입니다.   

- react-router-dom   
React 애플리케이션에서 클라이언트 사이드 라우팅을 구현하기 위한 라이브러리입니다.   

- react-query   
React Query는 서버에 데이터를 변경하는 작업을 처리하는 데 사용됩니다. 이는 주로 데이터 쓰기 작업, 예를 들어 POST, PUT, PATCH, 또는 DELETE 요청에 활용됩니다.   

- express   
Express.js는 Node.js 웹 애플리케이션을 위한 강력한 웹 프레임워크입니다.   
웹 애플리케이션의 서버 측 로직을 구축하는 데 도움이 되며,   
HTTP 요청에 대한 응답을 처리하고 경로 및 미들웨어를 관리하는 데 사용됩니다.   

- mongoose   
Node.js 환경에서 MongoDB를 사용하기 위한 Object Data Modeling (ODM) 라이브러리입니다.   

- jsonwebtoken   
Node.js 애플리케이션에서 JSON Web Tokens를 생성, 검증, 해독(decode)하는 데 사용되는 라이브러리입니다.

- bcrypt   
Node.js 환경에서 비밀번호 해싱 및 비교 작업을 수행할 때 자주 사용됩니다. bcrypt는 단방향 해싱 알고리즘으로 설계되어,   
암호화된 비밀번호를 원래 값으로 복구할 수 없게 만들어 보안을 강화합니다.   

- dotenv   
Node.js 애플리케이션에서 환경 변수를 쉽게 관리하고 로드할 수 있도록 도와주는 라이브러리입니다.   

- cors   
CORS(Cross-Origin Resource Sharing)는 브라우저에서 보안상의 이유로 동일 출처(Same-Origin Policy) 정책을 우회하여 다른 출처의 리소스에 접근할 수 있도록 해주는 메커니즘입니다.   

- cloudinary   
Cloudinary는 클라우드 기반의 미디어 관리 플랫폼으로, 이미지와 동영상 같은 미디어 파일의 저장, 관리, 최적화, 전송을 손쉽게 처리할 수 있도록 돕는 서비스입니다.   

## 🔍주요 기능   
[회원가입 및 로그인]   

MongoDB를 이용하여 회원가입 및 로그인 기능을 구현했습니다.   

<details>
  <summary>
  View Code
  </summary>   
  
  ```js
  const SignUpPage = () => {
    const [formData, setFormData] = useState({
      email: "",
      username: "",
      fullName: "",
      password: "",
    });

    const { mutate, isError, isPending, error } = useMutation({
      mutationFn: async ({ email, username, fullName, password }) => {
        try {
          const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, username, fullName, password }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to create account");
          console.log(data);
          return data;
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
      onSuccess: () => {
        toast.success("계정이 성공적으로 생성되었습니다.");
      },
    });

    const handleSubmit = (e) => {
      e.preventDefault(); // page will not reload
      mutate(formData);
    };

    const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
      // 레이아웃 코드
    );
  };
  ```
</details>   

</br>   

[게시글 및 코멘트]   

MongoDB를 이용하여 게시글 및 코멘트 기능을 구현했습니다.   

<details>
  <summary>
  View Code (포스트)
  </summary>   
  
  ```js
  const { mutate: createPost, isPending, isError, error } = useMutation({
    mutationFn: async ({ text, img }) => {
      try {
        const res = await fetch("/api/posts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, img }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error)
      }
    },
    onSuccess: () => {
      setText("");
      setImg(null);
      toast.success("post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    }
  });
  ```
</details>   

</br>   

<details>
  <summary>
  View Code (코멘트)
  </summary>   
  
  ```js
  const { mutate: commentPost, isPending: isCommenting } = useMutation({
      mutationFn: async () => {
        try {
          const res = await fetch(`/api/posts/comment/${post._id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: comment }),
          });

          const data = res.json();

          if (!res.ok) {
            throw new Error(data.error || "Something went wrong");
          }
          return data;
        } catch (error) {
          throw new Error(error);
        }
      },
      onSuccess: (post, newComment) => {
        toast.success("Comment posted successfully")
        setComment("");

        // 모든 게시글 리로드 대신 캐시를 바로 업데이트
        queryClient.invalidateQueries(["posts"], (oldData) => {
          return oldData.map((p) => {
            if (p._id === post._id) {
              return { ...p, comments: [...p.comments, newComment] }
            };
            return p;
          })
        })
      },
      onError: (error) => {
        toast.error(error.message)
      }
    });
  ```
</details>   

## 😭트러블 슈팅   
<details>
  <summary>
  View Code
  </summary>   
  
  ```js
  `No QueryClient set, use QueryClientProvider to set one`
  ```   

  - 문제 원인   
  QueryClientProvider이 없기떄문에 발생   

  - 문제 해결   
  QueryClientProvider로 감싸서 해결(client속성은 new QueryClient로 설정)
</details>   

## 📎사이트   
데이터베이스 - [mongoDB](https://www.mongodb.com/ko-kr)   
배포 - [mongoDB](https://render.com/)   
참조영상 - [mongoDB](https://www.youtube.com/watch?v=4GUVz2psWUg)   

## 📘스택   
<div>
  <a href="#"><img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=Vite&logoColor=white"></a>
  <a href="#"><img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind CSS-06B6D4?logo=Tailwind CSS&logoColor=white"></a>
  <a href="#"><img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=JavaScript&logoColor=white"></a>
  <a href="#"><img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-47A248?logo=MongoDB&logoColor=white"></a>
</div>