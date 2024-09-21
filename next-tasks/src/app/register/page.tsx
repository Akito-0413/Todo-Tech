"use client";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/actions/register";

export default function Register() {
  const [error, setError] = useState<string>();
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    const r = await register({
      email: formData.get("email"),
      password: formData.get("password"),
      name: formData.get("name"),
    });
    ref.current?.reset();
    if (r?.error) {
      setError(r.error);
      return;
    } else {
      return router.push("/login");
    }
  };

  return (
    <section className="w-full h-screen flex items-center justify-center">
      <form
        ref={ref}
        action={handleSubmit}
        className="p-6 w-full max-w-[400px] flex flex-col justify-between items-center gap-2 
            border border-solid border-black bg-white rounded text-black"
      >
        {error && <div className="">{error}</div>}
        <h1 className="mb-5 w-full text-2xl font-bold">アカウント登録</h1>

        <label className="w-full text-sm">名前</label>
        <input
          type="text"
          placeholder="名前"
          className="w-full h-8 border border-solid border-black py-1 px-2.5 rounded text-[13px]"
          name="name"
        />

        <label className="w-full text-sm">メールアドレス</label>
        <input
          type="email"
          placeholder="メールアドレス"
          className="w-full h-8 border border-solid border-black py-1 px-2.5 rounded"
          name="email"
        />

        <label className="w-full text-sm">パスワード</label>
        <div className="flex w-full">
          <input
            type="password"
            placeholder="パスワード"
            className="w-full h-8 border border-solid border-black py-1 px-2.5 rounded"
            name="password"
          />
        </div>

        <button className="w-full rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
          アカウント作成
        </button>

        <Link
          href="/login"
          className="text-sm text-[#888] transition duration-150 ease hover:text-black"
        >
          既にアカウントを持っている方はこちら！
        </Link>
      </form>
    </section>
  );
}
