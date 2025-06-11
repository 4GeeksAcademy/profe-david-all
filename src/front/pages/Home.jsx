import React, { useEffect, useState } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()
	const [form, setForm] = useState({
		email: "",
		password: ""
	})

	const handleForm = (event) => {
		let value = event.target.value;
		let type = event.target.name;
		setForm(prev => ({ ...prev, [type]: value }));
	}
const handleCreateUser = async () => {
  try {
    // saco cualquier slash al final
    const backendUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, '')
    // armo la URL completa bien
    const url = `${backendUrl}/api/create_user`
    console.log("🚀 POST a:", url)

    const response = await fetch(url, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    if (!response.ok) {
      throw new Error(`Servidor respondió ${response.status}`)
    }

    const data = await response.json()
    dispatch({ type: "save_new_user", payload: data.user || data })

  } catch (err) {
    console.error("handleCreateUser:", err)
  }
}

	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "/api/hello")
			const data = await response.json()

			if (response.ok) dispatch({ type: "set_hello", payload: data.message })

			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}

	}

	useEffect(() => {
		loadMessage()
	}, [])

	return (
		<div className="text-center mt-5">
			<h1 className="display-4">Hello Rigo!!</h1>
			<p className="lead">
				<img src={rigoImageUrl} className="img-fluid rounded-circle mb-3" alt="Rigo Baby" />
			</p>
			<div className="alert alert-info">
				{store.message ? (
					<span>{store.message}</span>
				) : (
					<span className="text-danger">
						Loading message from the backend (make sure your python 🐍 backend is running)...
					</span>
				)}
			</div>

			<div style={{ backgroundColor: "blue" }}>
				<h2>Crear usuario</h2>
				<br />
				<label htmlFor="nombre">email:</label>
				<input type="email" name="email" id="email" onChange={(e) => handleForm(e)} />
				<br />
				<label htmlFor="nombre">password:</label>
				<input type="password" name="password" id="password" onChange={(e) => handleForm(e)} />
				<br />
				<button onClick={handleCreateUser}>Crear usuario</button>

			</div>

			<div className="mt-4">
				{store.dataUser ? (
					<div>
						<p>ID: {store.dataUser.id}</p>
						<p>Email: {store.dataUser.email}</p>
					</div>
				) : (
					<p>Usuario todavía no creado</p>
				)}
			</div>


		</div>
	);
}; 