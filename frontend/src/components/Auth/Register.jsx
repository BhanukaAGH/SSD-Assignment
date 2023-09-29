import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { register as registerUser, reset } from '../../features/auth/authSlice'
import { Oval } from 'react-loader-spinner'
import { toast } from 'react-toastify'
// import { emailPattern } from '../../constants/pattern'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const schema = z.object({
  name: z
    .string()
    .nonempty({ message: 'Name is required' })
    .min(3, { message: 'Name must be at least 3 characters' }),
  email: z
    .string()
    .min(1, { message: 'Please enter a email address' })
    .email('Please enter a valid email address'),
  password: z
    .string()
    .nonempty({message:'password is required'})
    .min(6, { message: 'password need to have at least 6 Charters' }),
  confirm_password: z
    .string()
    .nonempty({message:'password confirm is required'})
}).refine((data) => data.password === data.confirm_password, {
  message: "Password doesn't match",
  path: ["confirm_password"]
});


const Register = ({ setOpenLogin }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })
  const dispatch = useDispatch()
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  const onSubmit = (data) => {
    data.userRole = 'user'
    dispatch(registerUser(data))
  }

  useEffect(() => {
    if (isError) {
      toast.error(message, { theme: 'dark' })
    }

    if (isSuccess && !isLoading && !isError && !user) {
      window.location.href = '/'
    }

    dispatch(reset())
  }, [user, isError, isLoading, isSuccess, message, dispatch])

  return (
    <div className='rounded-lg bg-white shadow font-[Mulish]'>
      <div className='p-6 md:p-12'>
        <p className='text-sm text-[#757575] pb-1'>Welcome to jobs.lk! 🙏</p>
        <h3 className='mb-6 text-xl text-gray-900 font-bold'>
          Create an account
        </h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-4'>
            <label htmlFor='name' className='input-label'>
              Your name
            </label>
            <input
              type='text'
              {...register('name')}
              className='auth-modal-input'
              placeholder='name'
            />
            {errors.name && (
              <p className='text-xs text-red-500 pt-0.5'>
                {errors.name.message}
              </p>
            )}
          </div>

          <div className='mb-4'>
            <label htmlFor='email' className='input-label'>
              Your email
            </label>
            <input
              type='text'
              {...register('email')}
              className='auth-modal-input'
              placeholder='email address'
            />
            {errors.email && (
              <p className='text-xs text-red-500 pt-0.5'>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className='mb-4'>
            <label htmlFor='password' className='input-label'>
              Password
            </label>
            <input
              type='password'
              {...register('password')}
              placeholder='password'
              className='auth-modal-input'
            />
            {errors.password && (
              <p className='text-xs text-red-500 pt-0.5'>
                {errors.password.message}
              </p>
            )}
          </div>

          <div className='mb-8'>
            <label htmlFor='confirm-password' className='input-label'>
              Confirm password
            </label>
            <input
              type='password'
              {...register('confirm_password')}
              placeholder='password'
              className='auth-modal-input'
            />
            {errors.confirm_password && (
              <p className='text-xs text-red-500 pt-0.5'>
                {errors.confirm_password.message}
              </p>
            )}
          </div>

          <button
            type='submit'
            className={`w-full rounded-lg bg-[#312ECB] px-5 ${
              isLoading ? 'py-1' : 'py-3'
            } text-center text-sm font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 uppercase flex items-center justify-center`}
          >
            {isLoading ? (
              <Oval
                height={30}
                width={30}
                color='#fff'
                secondaryColor='#4fa94d'
                strokeWidth={6}
                strokeWidthSecondary={6}
              />
            ) : (
              'Register'
            )}
          </button>
        </form>
        <p className='text-sm w-full text-center mt-6 font-bold text-[#6B7E8B]'>
          If you have an account?
          <span
            className='text-[#625BF7] cursor-pointer'
            onClick={() => setOpenLogin(true)}
          >
            {' '}
            Sign in
          </span>
        </p>
      </div>
    </div>
  )
}

export default Register
