'use client'

import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/shared/button'
import { Input } from '@/components/shared/input/input'
import { Label } from '@/components/shared/label/label'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/shared/tabs/tabs'
import { vendureFetch } from '@/libs/vendure'
import { useSearchParams } from 'next/navigation'
import {
  LOGIN_MUTATION,
  REGISTER_MUTATION,
  REQUEST_PASSWORD_RESET_MUTATION,
} from '@/libs/queries/account'
import {
  LoginInputs,
  loginSchema,
  SignupInputs,
  signupSchema,
  ResetPasswordInputs,
  resetPasswordSchema,
} from '@/utils/schemas/account'
import { Loader2 } from 'lucide-react'
import { useCart } from '@/components/cart/cart-context'

export default function AuthForm() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'reset'>(
    'login'
  )
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { isLoading, isLogged, fetchActiveOrder, addToCart } = useCart()

  const loginForm = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const signupForm = useForm<SignupInputs>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
    },
  })

  const resetPasswordForm = useForm<ResetPasswordInputs>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onLoginSubmit: SubmitHandler<LoginInputs> = async (data) => {
    setError(null)
    try {
      const result = await vendureFetch({
        query: LOGIN_MUTATION,
        variables: {
          email: data.email,
          password: data.password,
          rememberMe: data.rememberMe || false,
        },
      })

      if (result.error) {
        setError(result.error)
      } else if (result.data?.login) {
        if ('id' in result.data.login) {
          setSuccess('Inicio de sesión exitoso')

          handleRedirect()
        } else if ('errorCode' in result.data.login) {
          setError(result.data.login.message)
        }
      }
    } catch (err) {
      setError('Ocurrió un error al iniciar sesión')
    }
  }

  const onSignupSubmit: SubmitHandler<SignupInputs> = async (data) => {
    setError(null)
    try {
      const result = await vendureFetch({
        query: REGISTER_MUTATION,
        variables: {
          input: {
            emailAddress: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            password: data.password,
          },
        },
      })

      if (result.error) {
        setError(result.error)
      } else if (result.data?.registerCustomerAccount) {
        if ('success' in result.data.registerCustomerAccount) {
          setSuccess('Registro exitoso. Ahora puedes iniciar sesión.')
          setActiveTab('login')
        } else if ('errorCode' in result.data.registerCustomerAccount) {
          setError(result.data.registerCustomerAccount.message)
        }
      }
    } catch (err) {
      setError('Ocurrió un error al registrar la cuenta')
    }
  }

  const onResetPasswordSubmit: SubmitHandler<ResetPasswordInputs> = async (
    data
  ) => {
    setError(null)
    try {
      const result = await vendureFetch({
        query: REQUEST_PASSWORD_RESET_MUTATION,
        variables: {
          email: data.email,
        },
      })

      if (result.error) {
        setError(result.error)
      } else if (result.data?.requestPasswordReset) {
        if ('success' in result.data.requestPasswordReset) {
          setSuccess(
            'Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña.'
          )
        } else if ('errorCode' in result.data.requestPasswordReset) {
          setError(result.data.requestPasswordReset.message)
        }
      }
    } catch (err) {
      setError(
        'Ocurrió un error al solicitar el restablecimiento de contraseña'
      )
    }
  }
  const handleRedirect = async () => {
    const callbackUrl = searchParams.get('callback')
    const variantId = searchParams.get('variant')
    const quantity = searchParams.get('quantity')

    if (variantId && quantity) {
      await addToCart(variantId, Number(quantity))
    }

    if (callbackUrl) {
      window.location.href = callbackUrl
      // router.push(callbackUrl)
    } else {
      window.location.href = '/'
    }
  }
  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) =>
        setActiveTab(value as 'login' | 'signup' | 'reset')
      }
      className="w-full"
    >
      <TabsList className="flex h-auto w-full flex-wrap gap-3">
        <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
        <TabsTrigger value="signup">Registrarse</TabsTrigger>
        <TabsTrigger value="reset">Olvidé mi contraseña</TabsTrigger>
      </TabsList>
      {error && (
        <div className="mt-4 rounded bg-red-100 p-2 text-red-700">{error}</div>
      )}
      {success && (
        <div className="mt-4 rounded bg-green-100 p-2 text-green-700">
          {success}
        </div>
      )}
      <TabsContent value="login">
        <form
          className="space-y-4"
          onSubmit={loginForm.handleSubmit(onLoginSubmit)}
        >
          <div>
            <Label htmlFor="login-email">Correo Electrónico</Label>
            <Input
              id="login-email"
              type="email"
              {...loginForm.register('email')}
              className="mt-1"
            />
            {loginForm.formState.errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {loginForm.formState.errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="login-password">Contraseña</Label>
            <Input
              id="login-password"
              type="password"
              {...loginForm.register('password')}
              className="mt-1"
            />
            {loginForm.formState.errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {loginForm.formState.errors.password.message}
              </p>
            )}
          </div>
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              {...loginForm.register('rememberMe')}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <Label htmlFor="remember-me" className="ml-2">
              Recordarme
            </Label>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loginForm.formState.isSubmitting}
          >
            {loginForm.formState.isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Iniciar sesión'
            )}
          </Button>
        </form>
      </TabsContent>
      <TabsContent value="signup">
        <form
          className="space-y-4"
          onSubmit={signupForm.handleSubmit(onSignupSubmit)}
        >
          <div>
            <Label htmlFor="signup-email">Correo Electrónico</Label>
            <Input
              id="signup-email"
              type="email"
              {...signupForm.register('email')}
              className="mt-1"
            />
            {signupForm.formState.errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {signupForm.formState.errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="signup-firstName">Nombre</Label>
            <Input
              id="signup-firstName"
              type="text"
              {...signupForm.register('firstName')}
              className="mt-1"
            />
            {signupForm.formState.errors.firstName && (
              <p className="mt-1 text-sm text-red-600">
                {signupForm.formState.errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="signup-lastName">Apellido</Label>
            <Input
              id="signup-lastName"
              type="text"
              {...signupForm.register('lastName')}
              className="mt-1"
            />
            {signupForm.formState.errors.lastName && (
              <p className="mt-1 text-sm text-red-600">
                {signupForm.formState.errors.lastName.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="signup-password">Contraseña</Label>
            <Input
              id="signup-password"
              type="password"
              {...signupForm.register('password')}
              className="mt-1"
            />
            {signupForm.formState.errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {signupForm.formState.errors.password.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={signupForm.formState.isSubmitting}
          >
            {signupForm.formState.isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Registrarse'
            )}
          </Button>
        </form>
      </TabsContent>
      <TabsContent value="reset">
        <form
          className="space-y-4"
          onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)}
        >
          <div>
            <Label htmlFor="reset-email">Correo Electrónico</Label>
            <Input
              id="reset-email"
              type="email"
              {...resetPasswordForm.register('email')}
              className="mt-1"
            />
            {resetPasswordForm.formState.errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {resetPasswordForm.formState.errors.email.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={resetPasswordForm.formState.isSubmitting}
          >
            {resetPasswordForm.formState.isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Restablecer contraseña'
            )}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  )
}
