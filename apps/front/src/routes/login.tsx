import { useContext } from "react"
import { useForm } from "react-hook-form"
import { useMutation } from "urql"
import { authContext } from "../contexts/auth.context"
import { LOGIN } from "../utils/mutations"

export default function Login() {
    const { register, handleSubmit } = useForm()
    const [, loginUser] = useMutation(LOGIN)
    const { updateUser } = useContext(authContext)

    const onSubmit = (v: any) => {
        console.log(v)
        loginUser({ email: v.email, password: v.password }).then((data) => {
            console.log(data.data)
            localStorage.setItem("sirius_token", data.data.login.access_token)
            updateUser()

        })
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Email</label>
                <input type="email" {...register("email")} />
                <label>Password</label>
                <input type="password" {...register("password")} />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}