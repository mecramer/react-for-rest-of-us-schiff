import React, { useState, useEffect } from 'react';
import './App.css';

function OurApp () {
    // empty array of pet objects put into state
    const [ pets, setPets ] = useState([]);

    // useEffect() is a way to run code only when we want it to, by default it would run whenever this component re renders
    // For this one, only run once the first time this component is rendered
    // the first argument is a function you want to run
    // the second argument is the dependencies, or the things you want to watch for changes, which then calls the function,
    //   an empty array means only run the first time the component is rendered
    useEffect(() => {
        // check if the item already exists in localStorage
        // and if it does, get it and parse to change from string back to an array
        if (localStorage.getItem('examplePetData')) {
            setPets(JSON.parse(localStorage.getItem('examplePetData')));
        }
    }, []);

    // run every time our pet state changes
    useEffect(
        () => {
            // localStorage saves information on the computer
            // setItem, takes two arguments
            //   1. a name to associate with the saved data
            //   2. what to store in that name, here its the pets data
            // because it only accepts strings, we run JSON.stringify to turn the array of pets into a string
            localStorage.setItem('examplePetData', JSON.stringify(pets));
        },
        [ pets ],
    );
    return (
        <React.Fragment>
            <OurHeader />
            <LikeArea />
            <TimeArea />
            <AddPetForm setPets={setPets} />
            <ul>
                {/* mapping over the array of pets, using props for name, species, age, key, setPets is sent as a function
                    for pet component to use */}
                {pets.map((pet) => (
                    <Pet
                        id={pet.id}
                        setPets={setPets}
                        name={pet.name}
                        species={pet.species}
                        age={pet.age}
                        key={pet.id}
                    />
                ))}
            </ul>
            <Footer />
        </React.Fragment>
    );
}

// passing setPets as a prop from OurApp
// setPets takes the pets array and creates a new array, using concat
// we don't want to change the current array, because you never mutate state
// we are also setting state for the name, species and age
function AddPetForm (props) {
    const [ name, setName ] = useState();
    const [ species, setSpecies ] = useState();
    const [ age, setAge ] = useState();

    // on submit, create a new array with the submitted pet concatenated onto the pets array
    // the set the name, species, age fields to be blank again
    function handleSubmit (evt) {
        evt.preventDefault();
        props.setPets((prev) => prev.concat({ name: name, species: species, age: age, id: Date.now() }));
        setName('');
        setSpecies('');
        setAge('');
    }

    return (
        <form onSubmit={handleSubmit}>
            <fieldset>
                <legend>Add New Pet</legend>
                <input value={name} onChange={(evt) => setName(evt.target.value)} placeholder='Name' />
                <input value={species} onChange={(evt) => setSpecies(evt.target.value)} placeholder='species' />
                <input value={age} onChange={(evt) => setAge(evt.target.value)} placeholder='age in years' />
                <button>Add Pet</button>
            </fieldset>
        </form>
    );
}

function OurHeader () {
    return <h1 className='special'>Our Amazing App Header</h1>;
}

// useState is an array of two items (initial state and a function), common to destructure them into two variable names
function TimeArea () {
    const [ theTime, setTheTime ] = useState(new Date().toLocaleString());

    useEffect(() => {
        const interval = setInterval(() => setTheTime(new Date().toLocaleString()), 1000);

        return () => clearInterval(interval);
    }, []);

    return <p>The current time is {theTime}</p>;
}

// includes functions to increase and decrease the likeCount state
function LikeArea () {
    // set initial likeCount to what is in numberLikes in localStorage or 0 if it doesn't exist
    const [ likeCount, setLikeCount ] = useState(JSON.parse(localStorage.getItem('numberLikes')) || 0);

    // check for likes on first component load
    useEffect(() => {
        if (localStorage.getItem('numberLikes')) {
            setLikeCount(JSON.parse(localStorage.getItem('numberLikes')));
        }
    }, []);

    // update likes in memory when setLikeCount changes
    localStorage.setItem('numberLikes', JSON.stringify(likeCount));

    function increaseLikeHandler () {
        setLikeCount(function (prev) {
            return prev + 1;
        });
    }

    function decreaseLikeHandler () {
        setLikeCount(function (prev) {
            if (prev > 0) {
                return prev - 1;
            }
            return 0;
        });
    }

    return (
        <React.Fragment>
            <button onClick={increaseLikeHandler}>Increase likes</button>
            <button onClick={decreaseLikeHandler}>Decrease likes</button>
            <h2>This page has been liked {likeCount} times.</h2>
        </React.Fragment>
    );
}

function Pet (props) {
    // function used with the delete button to filter to a new array including everything but the item associated with the delete click
    // all pet items are returned to the new array as long as their id doesn't equal the id of clicked pet delete button
    function handleDelete () {
        props.setPets((prev) => prev.filter((pet) => pet.id !== props.id));
    }

    return (
        <li>
            {props.name} is a {props.species} and is {props.age} years old{' '}
            <button onClick={handleDelete}>Delete</button>
        </li>
    );
}

function Footer () {
    return <small>Copyright Footer Text</small>;
}

export default OurApp;
