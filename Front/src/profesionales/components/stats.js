import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import "./stats.css";
import Torta from "./piechart"
import Barchart from "./barchart"
import axios from "axios";

const host = process.env.REACT_APP_HOST_BACKEND

const data1 = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
];

const data2 = [
    { name: 'Felipe Espinoza', value: 205 },
    { name: 'Bastián Castro', value: 240 },
    { name: 'José Mera', value: 45 }
]

const Stats = () => {

    let [counter_citas, setCounter] = useState([]);
    let [years_options, setYearsOptions] = useState([]);
    let [loadingY, setLoadingY] = useState(true);
    const [selectedOption, setSelectedOption] = useState({});
    const [edition, setEdition] = useState(false);
    const [data3, setData3] = useState([]);

    useEffect(() => {
        axios.get((host + "/api/stats/getCitasCounter"))
            .then(res => {
                setCounter(res.data)
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        axios.get((host + "/api/stats/getYears"))
            .then(res => {
                setYearsOptions(res.data)
                setLoadingY(false);
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        if (selectedOption != "default") {
            axios.get((host + "/api/stats/getCitasFreq"), { params: { year: selectedOption} })
                .then(res => {
                    setData3(res.data)
                })
                .catch(err => console.log(err))
        }
    }, [])

    const handleChange = (selectedValue) => {
        selectedValue = selectedValue.target.value;
        if (selectedValue === "default") {
            setEdition(false)
        }
        else {
            setEdition(true);
        }
        setSelectedOption(selectedValue);
    }

    if (loadingY) {
        return (
            <Container fluid>
                <div className="loader-container">
                    <div className="spinner"></div>
                </div>
            </Container>
        )
    }
    else {

        if (edition & selectedOption.value != "select") {
            return (
                <Container fluid>
                    <Row className='title'>
                        <p><b>Estadísticas anuales</b></p>
                        <form className="form-year">
                            <label htmlFor="select-year">Seleccione año:</label>
                            <select name="years" id="select-year" value={selectedOption} onChange={handleChange}>
                                <option id="selected-option" selected value="default">Seleccionar año</option>
                                {years_options['value'].map(element => <option key={element} value={element}>{element}</option>)}
                            </select>
                        </form>
                        <Row className='subtitle'>
                            <p><b>Estadísticas generales</b></p>
                        </Row>
                        <Row className='row-content'>
                            <p>Cantidad de citas anuales:</p>
                            <b className='stats-citas'>{counter_citas}</b>
                        </Row>
                        <Row className='row-content'>
                            <p>Gráfico de citas por mes</p>
                            <Barchart data={data3}></Barchart>
                        </Row>
                        <Row className='row-content'>
                            <Col>
                                <Card className='chart-card'>
                                    <Card.Body>
                                        <Card.Title>Tipo de cita</Card.Title>
                                        <Torta data={data1}>
                                        </Torta>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col>
                                <Card className='chart-card'>
                                    <Card.Body>
                                        <Card.Title>Profesionales agendados</Card.Title>
                                        <Row>
                                            <p>El más agendado: <span style={{ color: "#82ca9d" }}>Bastián Castro</span></p>
                                        </Row>
                                        <Row>
                                            <Barchart data={data2}></Barchart>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Row>
                </Container>
            )
        }
        else {
            return (
                <Container fluid>
                    <Row className='title'>
                        <p><b>Estadísticas anuales</b></p>
                        <form className="form-year">
                            <label htmlFor="select-year">Seleccione año:</label>
                            <select name="years" id="select-year" value={selectedOption} onChange={handleChange}>
                                <option id="selected-option" selected value="default">Seleccionar año</option>
                                {years_options['value'].map(element => <option key={element} value={element}>{element}</option>)}
                            </select>
                        </form>
                    </Row>
                </Container>
            )
        }
    }

}

export default Stats;