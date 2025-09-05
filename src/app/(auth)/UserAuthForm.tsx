'use client';

import Button from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { useToast } from '@/hooks/useToast';
import { AtSign, Facebook, Github, Google, LogInSquare, Hide, View } from '@/svg_components';
import { signIn, type SignInResponse } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { z } from 'zod';

const emailSchema = z.string().trim().email();
const registrationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().trim().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export function UserAuthForm({ mode }: { mode: 'login' | 'register' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authMethod, setAuthMethod] = useState<'email-link' | 'email-password'>('email-password');
  const [inputError, setInputError] = useState<string | null>(null);
  const [loading, setLoading] = useState({
    email: false,
    emailPassword: false,
    github: false,
    facebook: false,
    google: false,
  });

  const areButtonsDisabled =
    loading.email || loading.emailPassword || loading.github || loading.facebook || loading.google;
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('from') || '/feed';
  const { showToast } = useToast();
  const router = useRouter();

  const onEmailChange = useCallback((text: string) => setEmail(text), []);
  const onPasswordChange = useCallback((text: string) => setPassword(text), []);
  const onNameChange = useCallback((text: string) => setName(text), []);

  const submitEmailPassword = useCallback(async () => {
    setLoading((prev) => ({ ...prev, emailPassword: true }));
    setInputError(null);

    try {
      if (mode === 'register') {
        const validateData = registrationSchema.safeParse({ name, email, password });
        if (!validateData.success) {
          setInputError(validateData.error.issues[0].message);
          return;
        }

        const result: SignInResponse | undefined = await signIn('credentials', {
          email: email.toLowerCase(),
          password,
          name,
          action: 'register',
          redirect: false,
        });

        if (result?.error) {
          setInputError(result.error);
          return;
        }

        showToast({ type: 'success', title: 'Account Created', message: 'Welcome to Cozy!' });
        router.push(callbackUrl);
      } else {
        const validateData = loginSchema.safeParse({ email, password });
        if (!validateData.success) {
          setInputError(validateData.error.issues[0].message);
          return;
        }

        const result: SignInResponse | undefined = await signIn('credentials', {
          email: email.toLowerCase(),
          password,
          action: 'login',
          redirect: false,
        });

        if (result?.error) {
          setInputError('Invalid email or password');
          return;
        }

        showToast({ type: 'success', title: 'Login Successful', message: 'Welcome back!' });
        router.push(callbackUrl);
      }
    } catch (error) {
      setInputError('Something went wrong. Please try again.');
    } finally {
      setLoading((prev) => ({ ...prev, emailPassword: false }));
    }
  }, [mode, name, email, password, showToast, router, callbackUrl]);

  const submitEmail = useCallback(async () => {
    setLoading((prev) => ({ ...prev, email: true }));

    const validateEmail = emailSchema.safeParse(email);
    if (validateEmail.success) {
      const signInResult: SignInResponse | undefined = await signIn('email', {
        email: email.toLowerCase(),
        redirect: false,
        callbackUrl,
      });

      setLoading((prev) => ({ ...prev, email: false }));

      if (!signInResult?.ok) {
        showToast({ type: 'error', title: 'Something went wrong' });
        return;
      }

      showToast({
        type: 'success',
        title: 'Email Sent',
        message: 'Please check your email to sign in.',
      });
    } else {
      setInputError(validateEmail.error.issues[0].message);
      setLoading((prev) => ({ ...prev, email: false }));
    }
  }, [email, callbackUrl, showToast]);

  const signInWithProvider = useCallback(
    (provider: 'github' | 'google' | 'facebook') => async () => {
      setLoading((prev) => ({ ...prev, [provider]: true }));

      try {
        const signInResult = await signIn(provider, { callbackUrl });

        setLoading((prev) => ({
          ...prev,
          [provider]: false,
        }));

        if (signInResult && typeof signInResult === 'object' && 'error' in signInResult && signInResult.error) {
          showToast({ type: 'error', title: 'Something went wrong' });
        }
      } catch (error) {
        setLoading((prev) => ({
          ...prev,
          [provider]: false,
        }));
        showToast({ type: 'error', title: 'Something went wrong' });
      }
    },
    [callbackUrl, showToast],
  );

  return (
    <>
      {/* Auth Method Toggle */}
      <div className="mb-4 flex gap-2">
        <Button
          onPress={() => setAuthMethod('email-password')}
          shape="pill"
          mode={authMethod === 'email-password' ? 'primary' : 'subtle'}
          expand="full">
          Email & Password
        </Button>
        <Button
          onPress={() => setAuthMethod('email-link')}
          shape="pill"
          mode={authMethod === 'email-link' ? 'primary' : 'subtle'}
          expand="full">
          Email Link
        </Button>
      </div>

      {authMethod === 'email-password' ? (
        <>
          {mode === 'register' && (
            <div className="mb-4">
              <TextInput
                value={name}
                onChange={onNameChange}
                label="Full Name"
                errorMessage={inputError?.includes('Name') ? inputError : undefined}
              />
            </div>
          )}
          <div className="mb-4">
            <TextInput
              value={email}
              onChange={onEmailChange}
              label="Email"
              errorMessage={inputError?.includes('email') ? inputError : undefined}
              Icon={AtSign}
            />
          </div>
          <div className="relative mb-4">
            <TextInput
              value={password}
              onChange={onPasswordChange}
              label="Password"
              type={showPassword ? 'text' : 'password'}
              errorMessage={
                inputError?.includes('Password') || inputError?.includes('password') ? inputError : undefined
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-16 top-[50%] translate-y-[-50%] p-2 hover:opacity-70"
              aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? (
                <Hide className="stroke-muted-foreground" width={20} height={20} />
              ) : (
                <View className="stroke-muted-foreground" width={20} height={20} />
              )}
            </button>
          </div>
          <div className="mb-5">
            <Button
              onPress={submitEmailPassword}
              shape="pill"
              expand="full"
              Icon={LogInSquare}
              loading={loading.emailPassword}
              isDisabled={areButtonsDisabled}>
              {mode === 'login' ? 'Login' : 'Sign up'}
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-4">
            <TextInput
              value={email}
              onChange={onEmailChange}
              label="Email"
              errorMessage={inputError || undefined}
              Icon={AtSign}
            />
          </div>
          <div className="mb-5">
            <Button
              onPress={submitEmail}
              shape="pill"
              expand="full"
              Icon={LogInSquare}
              loading={loading.email}
              isDisabled={areButtonsDisabled}>
              {mode === 'login' ? 'Login' : 'Sign up'} with Email Link
            </Button>
          </div>
        </>
      )}

      {inputError &&
        !inputError.includes('email') &&
        !inputError.includes('Password') &&
        !inputError.includes('Name') && <div className="mb-4 text-sm text-red-500">{inputError}</div>}

      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center px-1">
          <span className="w-full border-t border-muted" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-muted-foreground">OR CONTINUE WITH</span>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3">
        <Button
          onPress={signInWithProvider('github')}
          shape="pill"
          expand="full"
          mode="subtle"
          Icon={Github}
          loading={loading.github}
          isDisabled={areButtonsDisabled}>
          Github
        </Button>
        <div className="flex gap-2">
          <Button
            onPress={signInWithProvider('google')}
            shape="pill"
            expand="full"
            mode="subtle"
            Icon={Google}
            loading={loading.google}
            isDisabled={areButtonsDisabled}>
            Google
          </Button>
          <Button
            onPress={signInWithProvider('facebook')}
            shape="pill"
            expand="full"
            mode="subtle"
            Icon={Facebook}
            loading={loading.facebook}
            isDisabled={areButtonsDisabled}>
            Facebook
          </Button>
        </div>
      </div>
    </>
  );
}
