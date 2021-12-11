import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const NewPost = ({ image }) => {
	const {url, width, height} = image;

	const imgRef = useRef();
	const canvasRef = useRef();

	const [faces, setFace] = useState([]);
	const [friend, setFriend] = useState([]);

	const handleImage = async () => {
		const detections = await faceapi.detectAllFaces(
			imgRef.current,
			new faceapi.TinyFaceDetectorOptions()
		)
		setFace(detections.map(d=>Object.values(d.box)))
	}
	useEffect(()=>{
		const loadModels = () => {
			Promise.all([
				faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
				faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
				faceapi.nets.faceExpressionNet.loadFromUri('/models'),
			])
			.then(handleImage)
			.catch(e=>console.log(e));
		}
		imgRef.current && loadModels();
	},[])

	const enter = () => {
		const ctx = canvasRef.current.getContext('2d');
		ctx.lineWidth = 5;
		ctx.strokeStyle = 'cyan';
		faces.map(face => ctx.strokeRect(...face))
	}

	const addFriend = e => {
		setFriend((prev) => ({...prev, [e.target.name] : e.target.value}))
	}


	return (
		<div>
			<div className="container">
				<div className="left" style={{width, height}}>
					<img ref={imgRef} crossOrigin="anonymous" src={url} alt="" />
					<canvas onMouseEnter={enter} ref={canvasRef} width={width} height={height}/>
					{faces.map((face, i) => (
						<input
							name={`input${i}`}
							style={{ left: face[0], top: face[1] + face[3] + 5 }}
							placeholder="Tag a friend"
							key={i}
							className="friendInput"
							onChange={addFriend}
						/>
					))}
				</div>
				<div className="right">
					<h1>Share your post</h1>
					<input
						type="text"
						placeholder="What's on your mind?"
						className="rightInput"
					/>
					{friend && (
						<span className="friends">
							With <span className="name">{Object.values(friend) + " "}</span>
						</span>
					)}
					<button className="rightButton">Send</button>
				</div>
			</div>
		</div>
	)
}

export default NewPost
