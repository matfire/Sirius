import { useContext } from "react"
import { useForm } from "react-hook-form"
import { useMutation } from "urql"
import { authContext } from "../contexts/auth.context"
import { REGISTER } from "../utils/mutations"

export default function Register() {
    const { register, handleSubmit } = useForm()
    const [, registerUser] = useMutation(REGISTER)
    const { updateUser } = useContext(authContext)
    const onSubmit = (v: any) => {
        registerUser({ ...v }).then((res) => {
            localStorage.setItem("sirius_token", res.data.register.access_token)
            updateUser()
        })
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Username</label>
                <input type="text" {...register("username")} />
                <label>Email</label>
                <input type="email" {...register("email")} />
                <label>Password</label>
                <input type="password" {...register("password")} />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}