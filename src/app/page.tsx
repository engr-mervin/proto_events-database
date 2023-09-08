"use client";
import { useEffect, useState } from "react";

// const readImage = (buffer: Buffer) =>
//   new Promise<any>((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = function () {
//       const imageDataURL = reader.result; // This will be the data URL
//       resolve(imageDataURL);
//     };
//     reader.onerror = function () {
//       reject("something went wrong");
//     };
//     reader.readAsDataURL(new Blob([buffer]));
//   });

const Home = function () {
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [imageURL, setImageURL] = useState<string>("");
  const [events, setEvents] = useState<any>(null);

  const getEvents = async function () {
    const response = await fetch("/api/event");

    const body = await response.json();

    if (!body) return;

    console.log(body.data[0].image);
    setEvents(body.data);
  };

  useEffect(() => {
    getEvents();
  }, []);

  const uploadToServer = async function (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    if (description === "") {
      setError("Please input description.");
      return;
    }
    const body = new FormData();
    if (image === null) {
      setError("Please add an image.");
      return;
    }

    body.append("image", image);
    body.append("description", description);

    const response = await fetch("/api/event", {
      method: "POST",
      body,
    });

    const data = await response.json();
    console.log(data);
  };

  const uploadToClient = function (
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    e.preventDefault();

    if (!e.target.files) {
      setError("No files selected.");
      return;
    }

    const selectedImage = e.target.files[0];

    if (!selectedImage.type.startsWith("image")) {
      setError("File is not an image.");
      return;
    }

    setImage(selectedImage);

    const url = URL.createObjectURL(selectedImage as Blob);
    setImageURL(url);
    setError("");
  };
  return (
    <>
      <h1>Events</h1>
      <form className="form" onSubmit={uploadToServer}>
        <div className="input-group">
          <label id="label--file" htmlFor="input--file">
            Select Image
          </label>
          <input type="file" id="input--file" onChange={uploadToClient} />
        </div>
        <div className="input-group">
          <label id="label--description" htmlFor="input--description">
            Description
          </label>
          <textarea
            id="input--description"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          ></textarea>
        </div>
        <button type="submit">Post</button>
      </form>
      <p>{error}</p>
      <img src={imageURL}></img>

      <ul>
        {events
          ? events.map((el: any) => {
              return (
                <li key={el.id}>
                  <img src={`data:image/png;base64,${el.image}`}></img>
                  <p>{el.description}</p>
                </li>
              );
            })
          : ""}
      </ul>
    </>
  );
};

export default Home;
