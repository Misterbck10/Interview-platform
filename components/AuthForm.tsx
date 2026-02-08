"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"


import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import Image from 'next/image'
import Link from "next/link";


const formSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be at most 20 characters"),
})

const AuthForm = ({ type }: {type: FormType}) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
        // Do something with the form values.
        console.log(data)
    }

    const isSignIn = type === 'sign-in';

    return (
        <div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image
                        src="/logo.svg"
                        alt="logo"
                        height={32}
                        width={38}
                    />
                    <h2 className="text-primary-100">PrepWise</h2>
                </div>
                <h3>Practice job interview with AI </h3>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
                        {!isSignIn && <p>Name</p>}
                        <p>Email</p>
                        <p>Password</p>



                        <Button type="submit" className="btn">{isSignIn ? 'Sign in' : 'Create an Account'}</Button>
                    </form>
                </Form>

                <p className="text-center">
                    {isSignIn ? 'No account yes?' : 'Have an account already?'}
                    <Link href={!isSignIn ? '/sign-in' : '/sign-up'}
                    className="font-bold text-user-primary ml-1"
                    >
                        {!isSignIn ? 'Sign In' : '/sign-up'}
                    </Link>

                </p>
        </div>
</div>
    )
}
export default AuthForm
