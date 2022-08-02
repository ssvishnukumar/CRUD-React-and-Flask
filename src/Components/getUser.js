import React , { useEffect, useState }from 'react'
import axios from 'axios';
import { Table, Button, Form, Carousel } from 'react-bootstrap';
import { Link } from "react-router-dom";

import "../styling/getUser.css"

export default function GetUser() {
    const [allUsers, setAllUsers] = useState([{}]); // to get all the users

    const [ searchUser, setSearchUser ] = useState(""); // text in the search bar
    const [ userFound, setUserFound ] = useState(null); // if user is found,then we will be changing the value...otherwise no

    const [ matchingUsers, setMatchingUsers ] = useState([]);
    const [ exactUser, setExactUser ] = useState([]);


    useEffect(() => {
        axios.get('/allusers')
        .then((getData => {
            // console.log(getData.data);
            setAllUsers(getData.data);
        }))
    }, []);
 

    function onSearchUser(eve) {
      eve.preventDefault();
      setUserFound(null); // if the searchUser is empty then we are setting the userFound to null
      console.log("Entered the Search Function...")
      if (searchUser !== ""){
        setUserFound(false);
        setMatchingUsers([]); // while pressing submit button.. setting it to an empty array...For not getting collapsed with the next iteration.
        setExactUser([]); // while pressing submit button.. setting it to an empty array...For not getting collapsed with the next iteration.
        eve.preventDefault();
  
        let matchingUsersArray = []
        let exactUserArray = []
  
        let id = Object.keys(allUsers) // returns all the user keys of the object in an array.
        
        console.log('allUsers :',allUsers)
  
        // exact user
        let exactUserId = id.filter(key => allUsers[key]['username'].toLowerCase() === searchUser)
          .map((keyy) => {
            setUserFound(true)
            exactUserArray.push({
              "id" : keyy,
              "username" :  allUsers[keyy]['username'],
              "userage" :  allUsers[keyy]['userage'],
              "usercity" :  allUsers[keyy]['usercity']
            })
            return(
              setExactUser(exactUserArray),
              keyy // here we are returning key to exclude this exact user key from the related user list in the upcoming operations.
            )
          }
          )
        
        // matching user
        id.filter(key => {
          let relatedUser = allUsers[key]["username"].toLowerCase();
          let foundRelatedUser = relatedUser.includes(searchUser);
          return( 
            foundRelatedUser && key !== exactUserId[0]
          )
          })
          .map((keyy) => {
            matchingUsersArray.push({
              "id": keyy,  
              "username" : allUsers[keyy]["username"],
              "userage" : allUsers[keyy]["userage"],
              "usercity" : allUsers[keyy]["usercity"]
            })
            return(
              setMatchingUsers(matchingUsersArray)
            )
        })
      }
    }

    const setData = (name, age, city) => {
      console.log(name, age, city)
      return(
        // here we are gonna set the Items in the local storage and we will be using this keys and values in the update and delete user files. And in any files if needed.
        localStorage.setItem("LocalStorageUserName", name), // here local storage user name is a key, that we can see in the console page...go to applications and see the localstorage
        localStorage.setItem("LocalStorageUserAge", age),
        localStorage.setItem("LocalStorageUserCity",city)
      )
    }

    // this is going to get the updated data and show it one the all users page
    const getData = () => {
      axios.get('/allusers')
      .then((getData => {
          // console.log(getData.data);
          setAllUsers(getData.data);
      }))
    }

    const onDelete = (name) => {
      axios.delete(`/${name}`)
      .then(()=> {
        getData(); // this will get the updated data after deleting a particular user with his username.
      })
      
    }


    console.log('EXACT USER (OUTSIDE) : ', exactUser)
    console.log('MATCHING USERS (OUTSIDE) : ', matchingUsers)


    return (
    <div className="allUsers" >
    <h1 style={{textAlign: 'center', marginBottom: '20px'}}>All Users</h1>

      <Form >
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Control 
          style={{borderRadius:16}}
          type="Text" 
          label="Check me out" 
          placeholder="Type something here..."
          onChange={(e) => setSearchUser(e.target.value.toLowerCase())}
        />
      </Form.Group> 

      <Button variant="primary" type="submit" onClick={onSearchUser} style={{color: "#000", backgroundColor: "#90CAF9", border: "2px solid #fff",margin: "auto", marginLeft:175, marginBottom:20, borderRadius:16}} >
        Submit
      </Button>
      </Form>
  
      { userFound === true ? 
        <div className={(userFound === true) ? 'userFound' : 'userNotFound'}>
          <div className='singleUser'>
        
          <Carousel>
            <Carousel.Item interval={5000}>
              <p style={{ backgroundColor: '#c7ffe5', color: "#000", border: "3px solid #000"}}>EXACT USER</p>
                {exactUser.map((userr, index) => {
                  return(
                    <div key={index}>
                      <p >
                        USER ID : {userr['id']}
                      </p>
                      <p >
                        USER NAME : { userr['username']}
                      </p>
                      <p >
                        USER AGE : {userr['userage']}
                      </p>
                      <p >
                        USER CITY : {userr['usercity']}
                      </p>
                    </div>
                  )
                })
                }

            </Carousel.Item>

              {matchingUsers.map((matchuser, i) => {
                return(
                    <Carousel.Item key={i} interval={2000}>
                      <p style={{ backgroundColor: '#ff8585', color: "#000", border: "3px solid #000"}}>
                        MATCHING USER
                      </p>
                        <p>
                          USER ID : {matchuser["id"]}
                        </p>
                        <p>
                          USER NAME : {matchuser["username"]}
                        </p>
                        <p>
                          USER AGE : {matchuser["userage"]}
                        </p>
                        <p>
                          USER CITY : {matchuser["usercity"]}
                        </p>
                    </Carousel.Item>
                )
              })}
          </Carousel>

          </div>
        </div>
        :
        <div className={(userFound === false) ? 'showMessage' : 'dontShowMessage'}>
          
          { matchingUsers.length===0 
          ? 
            <div className='singleUserMessage'>
              <p style={{ backgroundColor: '#ff6969', color: "#fff"}} >USER NOT FOUND.</p>
            </div>
          :
          <Carousel interval={2000}>
          {matchingUsers.map((matchuser, i) => {
                  return(
                      <Carousel.Item key={i} >
                        <p style={{ backgroundColor: '#ff8585', color: "#000", border: "3px solid #000"}}>
                          MATCHING USER
                        </p>
                          <p>
                            USER ID : {matchuser["id"]}
                          </p>
                          <p>
                            USER NAME : {matchuser["username"]}
                          </p>
                          <p>
                            USER AGE : {matchuser["userage"]}
                          </p>
                          <p>
                            USER CITY : {matchuser["usercity"]}
                          </p>
                      </Carousel.Item>
                  )
                })}
          </Carousel>
          }
          </div>
          }
    <Table borderless >
    {/* <Table borderless style={{textAlign: 'center'}}> */}
      <thead >
        <tr className='heading' >
          <th className="heading" style={{color: "black", borderTopLeftRadius:16, borderBottomLeftRadius:16}}  >ID</th>
          <th className="heading" style={{color: "black"}} >USER NAME</th>
          <th className="heading" style={{color: "black"}} >AGE</th>
          <th className="heading" style={{color: "black"}} >CITY</th>
          <th className="heading" style={{color: "black"}} >UPDATE</th>
          <th className="heading" style={{color: "black", borderTopRightRadius:16, borderBottomRightRadius:16}} >DELETE</th>
        </tr>
      </thead>
      <tbody >
        {Object.keys(allUsers).map(key => {
            return(
                <tr key={key} >
                    <td >{key}</td>
                    <td>{allUsers[key]["username"]}</td>
                    <td>{allUsers[key]["userage"]}</td>
                    <td>{allUsers[key]["usercity"]}</td>
                    <td>
               
                      <Link style={{ textDecoration:"none" }} to="/update">
                        <button onClick={()=> {
                                    setData(
                                      // here we are passing the arguments
                                      allUsers[key]["username"],
                                      allUsers[key]["userage"], 
                                      allUsers[key]["usercity"] 
                                    )
                                  }
                                  } 
                                style={{backgroundColor: "#c7ffe5", borderRadius:"1rem", border: 'none', fontSize:'12px', color: '#3a3a3a'}}>Update</button>
                      </Link>
                    </td>
                    <td>
                      {/* <Link style={{ textDecoration:"none" }} to="/delete"> */}
                        <button onClick={()=> onDelete(allUsers[key]['username'])} style={{backgroundColor: "#ff8585", borderRadius:"1rem", border: 'none', fontSize:'12px', color:'#3a3a3a'}}>Delete</button>
                      {/* </Link> */}
                    </td>
                </tr>
            )
        })}
      </tbody>
    </Table>

    </div>
  )
}
