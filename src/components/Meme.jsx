import {useEffect,useState} from "react"

export default function Meme() {
    function downloadMeme() {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
    
        img.crossOrigin = "anonymous";
        img.src = meme.randomImage;
    
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
    
            ctx.drawImage(img, 0, 0);
    
            ctx.fillStyle = "white";
            ctx.font = "bold 30px Impact";
            ctx.textAlign = "center";
    
            ctx.fillText(meme.topText, canvas.width / 2, 40);
            ctx.fillText(meme.bottomText, canvas.width / 2, canvas.height - 20);
    
            const dataURL = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = dataURL;
            link.download = "meme.png";
            link.click();
        };
    }
    
    const [meme, setMeme] = useState({
        topText: "",
        bottomText: "",
        randomImage: "http://i.imgflip.com/1bij.jpg" 
    })
    const [allMemes, setAllMemes] = useState([])
    
    /**
    useEffect takes a function as its parameter. If that function
    returns something, it needs to be a cleanup function. Otherwise,
    it should return nothing. If we make it an async function, it
    automatically retuns a promise instead of a function or nothing.
    Therefore, if you want to use async operations inside of useEffect,
    you need to define the function separately inside of the callback
    function, as seen below:
    */
    
    useEffect(
        ()=>
        {
            async function getMemes()
            {
                const res = await fetch("https://api.imgflip.com/get_memes")
                const data = await res.json()
                setAllMemes(data.data.memes)
            }
            getMemes()
            
            return ()=>
            {
                //Cleanup function
                //in this case we need not implemnet one 
            }
            
        },
        []//dependency array
    )
    
    
    function getMemeImage() {
        const randomNumber = Math.floor(Math.random() * allMemes.length)
        const url = allMemes[randomNumber].url
        setMeme(prevMeme => ({
            ...prevMeme,
            randomImage: url
        }))
    }
    
    function handleChange(event) {
        const {name, value} = event.target
        setMeme(prevMeme => ({
            ...prevMeme,
            [name]: value
        }))
    }
    
    return (
        <main>
            <div className="form">
                <input 
                    type="text"
                    placeholder="Top text"
                    className="form--input"
                    name="topText"
                    value={meme.topText}
                    onChange={handleChange}
                />
                <input 
                    type="text"
                    placeholder="Bottom text"
                    className="form--input"
                    name="bottomText"
                    value={meme.bottomText}
                    onChange={handleChange}
                />
                <button 
                    className="form--button"
                    onClick={getMemeImage}
                >
                    Get a new meme image 🖼
                </button>
                <button
    className="form--button"
    onClick={downloadMeme}
>
    Download Meme 📥
</button>

            </div>
            <div className="meme">
                <img src={meme.randomImage} className="meme--image" />
                <h2 className="meme--text top">{meme.topText}</h2>
                <h2 className="meme--text bottom">{meme.bottomText}</h2>
            </div>
        </main>
    )
}
