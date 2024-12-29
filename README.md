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

- react-router-dom   

- react-query   

- express   

- mongoose   

- jsonwebtoken   

- bcrypt   

- dotenv    

- cors    

- cloudinary    

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
`No QueryClient set, use QueryClientProvider to set one`
해결방법: QueryClientProvider로 감싸서 해결(client속성은 new QueryClient로 설정)

## 📎사이트   

## 📘스택   
