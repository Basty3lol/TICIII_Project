import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default class Barchart extends PureComponent {

    render() {

        const { data } = this.props;

        return (
            <div style={{ width: '100%', height: 360 }}>
                <ResponsiveContainer>
                    <BarChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid horizontal={false} vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar name="Citas" dataKey="value" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>

            </div>
        );
    }
}