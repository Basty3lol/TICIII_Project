import React from 'react'
import "./css-img/nosotros.css"
import {Col, Row, Container} from "react-bootstrap";

import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

import imagenChelo from "./css-img/Chelo.jpg"
import imagenJavi from "./css-img/Javiera.jpeg"
import imagenJoaco from "./css-img/Joaquin.jpeg"
import imagenFran from "./css-img/Francisco.jpeg"

const useStyles1 = makeStyles((theme) => ({
    root: {
      margin: "auto",
      height: "100%",
      width: '100%',
      //maxWidth: '36ch',
      backgroundColor: "rgba(255,255,255,0.5)"
    },
    inline: {
      display: 'inline',
    },
}));

const useStyles2 = makeStyles((theme) => ({
root: {
    justify: 'right',
    width: '66%',
    //maxWidth: '36ch',
    backgroundColor: "rgba(255,255,255,0.5)"
},
inline: {
    display: 'inline',
},
}));


const Nosotros = () => {
    
    const classes1 = useStyles1();
    const classes2 = useStyles2();

    return(

        // <div className="bg">
            <Container fluid className="bg">
            <Row className="Title">
            <Col className="col1" md={12} xs={12} offset={12}>
                <h1 >Nuestra Mision</h1>
            </Col>
            </Row>
            <Row>
            <Col className="col1" md={12} xs={12} offset={12}>
                <h5 className='mision'>Como institución nos interesa acercar la atención psicológica de calidad a a personas con diversas problemáticas, centrándonos en sus necesidades y adaptándonos a su contexto de vida.
                </h5>
            </Col>
            </Row>

            <Row className="Title">
            <Col className="col1" md={12} xs={12} offset={12}>
                <h1>Nuestro Equipo</h1>
            </Col>
            
            </Row>
            <Row className="row-content">
                <Col md={4} xs={4} offset={4}>
                <Card className={classes1.root}>
                    <CardActionArea>
                        <CardContent>
                        <Avatar
                        alt="Chelo"
                        src={imagenChelo}
                        className={classes1.bigAvatar}
                        />
                        <Typography gutterBottom variant="h5" component="h2">
                            Marcelo Robertson Armijo
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Psicólogo clínico (infanto-juvenil). Enfoque psicodinámico
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
                </Col>

                <Col md={4} xs={4} offset={8}>
                <Card className={classes1.root}>
                    <CardActionArea>
                        <CardContent>
                        <Avatar
                        alt="Javiera"
                        src={imagenJavi}
                        className={classes1.bigAvatar}
                        />
                        <Typography gutterBottom variant="h5" component="h2">
                            Javiera López López 
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Psicóloga 
                            Línea teórica cognitivo constructivista con enfoque de género.
                            Certificación en WISC V y WAIS IV.
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
                </Col>

                <Col md={4} xs={4} offset={12}>
                <Card className={classes1.root}>
                    <CardActionArea>
                        <CardContent>
                        <Avatar
                        alt="Joaquin Bravo Darrouy"
                        src={imagenJoaco}
                        className={classes1.bigAvatar}
                        />
                        <Typography gutterBottom variant="h5" component="h2">
                            Joaquin Bravo Darrouy
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Psicologo clinico (infanto-juvenil y adultos). Enfoque psicodinamico.
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
                </Col>
            </Row>

            <Row>
                <Col className="last-cols1 d-flex" md={6} xs={6} offset={6}>
                <Card className={classes2.root}>
                    <CardActionArea>
                        <CardContent>
                        <Avatar
                        alt="Francisco"
                        src={imagenFran}
                        className={classes2.bigAvatar}
                        />
                        <Typography gutterBottom variant="h5" component="h2">
                            Francisco Valdés Morales
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Psicólogo Clínico. Atención a Jóvenes y Adultos. Enfoque Posracionalista
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
                </Col>

                <Col className="last-cols2" md={6} xs={6} offset={12}>
                <Card className={classes2.root}>
                    <CardActionArea>
                        <CardContent>
                        <Avatar
                        alt="Chelo"
                        src={imagenChelo}
                        className={classes2.bigAvatar}
                        />
                        <Typography gutterBottom variant="h5" component="h2">
                            Lizard
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                            across all continents except Antarctica
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
                </Col>
            </Row>
            </Container>
        //</div>
    )
}
export default Nosotros