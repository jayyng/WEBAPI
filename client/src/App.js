import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import {
  Jumbotron,
  Alert,
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Table,
  Modal, 
  ModalHeader,
  ModalBody,
  ModalFooter


} from 'reactstrap';

class App extends Component {
  constructor() {
    super();
    this.state = {
      requiredhero: 0,
      alertVisible: false,
      isShowing: false,
      modalIsOpen: false,
      modal2IsOpen: false,
      name: '',
      fullname:'',
      publisher:'',
      _id: '',
      heroes: [],

    };
 
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this); 
    this.editHero = this.editHero.bind(this);
  }

  // for form field
  onChange(e) {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
      [e.target.fullname]: e.target.value,
      [e.target.publisher]: e.target.value

    });
  }
  //for error modal 
  toggleModal() {
   
    this.setState({
      modalIsOpen: ! this.state.modalIsOpen
    });
  }
  //for edit modal 
  toggleEdit(){
    this.setState({
      modal2IsOpen: ! this.state.modal2IsOpen
    })
  }
  
  componentDidMount() {
    this.getAllHeroes();
  }

  //for popup
  onDismiss() {
    this.setState({ alertVisible: false });
  }
  //for form
  onSubmit = e => {
    e.preventDefault();
    this.setState({ alertVisible: false });

    const query = `/gethero?name=${this.state.name}`;

    console.log(query);

    axios
      .get(query)
      .then(result => {
        console.log(result.data);
        if (result.data === 'Not Found' ) {
          this.setState({ alertVisible: true });
        }
        this.getAllHeroes();
      })
      .catch(error => {
        this.setState(this.toggleModal());
      });
    
  };
  //display all saved superheroes
  getAllHeroes = () => {
    axios
      .get('/getallheroes')
      .then(result => {
        this.setState({ heroes: result.data });
        console.log(this.state.heroes);
      })
      .catch(error => {
        console.log(error);
      });
    
  };
  //get hero data to display in modal
  gethero(_id,name,fullname,publisher){
    
    this.setState({
      _id,
      name,
      fullname,
      publisher
    }); 

    this.toggleEdit();
    
  }
  //update the hero data
  editHero= (_id,name,fullname,publisher) =>{

    const query = `/edithero?_id=${_id}&name=${name}&fullname=${fullname}&publisher=${publisher}`;

    axios
      .get(query)
      .then(result => {
        console.log(result);
       
        this.getAllHeroes();
      })
      .catch(error => {
        alert('Error: ', error);
      });
    this.toggleEdit();
  }

  //delete hero 
  removeHero(_id) {
    this.setState({
      heroes: this.state.heroes.filter(hero => {
        if (hero._id !== _id) return hero;
      })
    }); 
    const query = `/deletehero?_id=${_id}`;
    axios
      .get(query)
      .then(result => {
        console.log(result);
        this.getAllHeroes();
      })
      .catch(error => {
        alert('Error: ', error);
      });
  }

  render() {
    
    return (
      
      <div>
        
        <Jumbotron className="App">
          <h1 className="display-3">SuperHeroes</h1>
          <p className="lead">Search for superheroes</p>
          <br></br>
          <p className="lead">Consider adding Roman Numerals when a different hero variation appears</p>
        </Jumbotron>
        <Container>
          
          <Row>
            <Col>
              <Alert
                color="danger"
                isOpen={this.state.alertVisible}
                toggle={this.onDismiss}
              >
                Superhero not found
              </Alert>
            </Col>
          </Row>
          <Row>
            <Col className="App">
              <Form onSubmit={this.onSubmit}>
                <FormGroup>
                  <Label for="title">Enter Superhero Name</Label>
                  <Input
                    type="text"
                    name="name"
                    id="id"
                    placeholder="enter supehero name..."
                    onChange={this.onChange}
                  />
                </FormGroup>
                <Button color="primary">Submit</Button>
                <p />
              </Form>
            </Col>
          </Row>
          <Row>
            <Table responsive striped bordered hover>
            
              <thead>
                <tr>
                  <th>Poster</th>
                  <th>Profile</th>
                  <th>Relevant Movies</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.state.heroes.map((hero) => {
                  return (
                    <tr>
                      <td>
                        <img src={hero.poster} />
                      </td>

                      <td >
                      
                        <h1 className="App">{hero.name}</h1>
                     
                        <p className="App">AKA</p>
                        <p className="App">{hero.fullname}</p>
                        
                        <br></br>
                        <h4>Powerstats:</h4>
                        <p>Intelligence: {hero.intelligence}</p>
                        <p>Strength: {hero.strength}</p>
                        <p>Speed: {hero.speed}</p>
                        <p>Durability: {hero.durability}</p>
                        <p>Power: {hero.durability}</p>
                        <p>Combat: {hero.combat}</p>
                        <br></br>
                        <br></br>
                        <p>Publisher: {hero.publisher}</p>

                      </td>
                      <td>
                        <img src= {hero.movieposter}></img>
                        <p>Movie Title: {hero.title}</p>
                        <p>Released: {hero.year}</p>
                        <p>Genre: {hero.genre}</p>
                        <p>Casts: {hero.actors}</p>
                        <p>Plot: {hero.plot}</p>

                      </td>
                      <td className="App">
                        <Button color='danger' 
                          onClick={() => {
                            this.removeHero(hero._id);
 
                          }}
                        >
                          <span class="glyphicon glyphicon-remove"></span> Delete
                        </Button>
                        <hr></hr>
                        <Button color="secondary" onClick={ ()=> {this.gethero(hero._id,hero.name,hero.fullname,hero.publisher)}}>Edit</Button>
                        <Modal isOpen={this.state.modalIsOpen} className="App">
                        <ModalHeader toggle={ this.toggleModal.bind(this)}><h4>Error Message</h4></ModalHeader>
                          <ModalBody>
                            <h1>Superhero Not Found.</h1>
                            <br></br>
                            <hr></hr>
                            <p>Please Try Another Name</p>
                          </ModalBody>
                          <ModalFooter>
                            <Button color="danger" onClick={this.toggleModal.bind(this)}>OK</Button>
                            
                          </ModalFooter>
                        </Modal>   
                      </td>
                    </tr>
                  );
                })}
                
                <Modal isOpen={this.state.modal2IsOpen} className="App">
                <ModalHeader toggle={ this.toggleEdit.bind(this)} ><h4>Edit Your Hero</h4></ModalHeader>
                  <ModalBody>
                    <div class="row">
                      <div class="col-2">
                        <p>Name:</p>
                      </div>
                      <div class="col-10">
                        <Input
                        type="text"
                        name="name"
                        id="id"
                        value={this.state.name}
                        onChange={(this.onChange.bind(this))}
                       
                        required
                        ></Input>
                      </div>
                    </div>
                    <br></br>
                    <div class="row">
                      <div class="col-2">
                        <p>Fullname:</p>
                      </div>
                      <div class="col-10">
                        <Input
                        type="text"
                        name="fullname"
                        id="id"
                        value={this.state.fullname}
                        onChange={this.onChange.bind(this)}
                        required
                        ></Input>
                      </div>
                    </div>
                    <br></br>
                    <div class="row">
                      <div class="col-2">
                        <p>Publisher:</p>
                      </div>
                      <div class="col-10">
                        <Input
                        type="text"
                        name="publisher"
                        id="id"
                        value={this.state.publisher}
                        onChange={this.onChange.bind(this)}
                        required
                        ></Input>
                      </div>
                    </div>  
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" onClick={this.toggleEdit.bind(this)} data-dismiss="modal" >Cancel</Button>
                    <Button color="primary" onClick={() => {this.editHero(this.state._id,this.state.name,this.state.fullname, this.state.publisher)}} data-dismiss="modal">Save Changes</Button>
                  </ModalFooter>
                </Modal>   
              </tbody>
            </Table>
          </Row>
          
        </Container>
        

       
      </div>
      
    );
  }
 
}

export default App;

