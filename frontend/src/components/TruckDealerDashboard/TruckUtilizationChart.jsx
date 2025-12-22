import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { useAnimate, useAnimateBar, useDrawingArea } from '@mui/x-charts/hooks';
import { PiecewiseColorLegend } from '@mui/x-charts/ChartsLegend';
import { interpolateObject } from '@mui/x-charts-vendor/d3-interpolate';
import Box from '@mui/material/Box';
import APIS, { privateApi } from '../../apis.js';

export default function TruckUtilizationChart({ truckDealerId }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await privateApi.get(`${APIS.getTruckStats}/${truckDealerId}`);
                setData(res.data.data || []);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch truck stats');
            } finally {
                setLoading(false);
            }
        };

        if (truckDealerId) fetchData();
    }, [truckDealerId]);

    if (loading) return <div>Loading chart...</div>;
    if (error) return <div className="text-red-600">{error}</div>;
    if (!data.length) return <div>No trucks found</div>;

    return (
        <Box width="100%">
            <Typography marginBottom={2} marginLeft={3} variant="h6">
                Top 5 Truck Utilization (% of Weight Capacity) by Models
            </Typography>
            <BarChart
                height={300}
                dataset={data}
                series={[
                    {
                        id: 'utilization',
                        dataKey: 'utilizationPercentage',
                        stack: 'utilization',
                        valueFormatter: (value) => `${value}%`,
                    },
                ]}
                layout="horizontal"
                xAxis={[
                    {
                        id: 'color',
                        min: 0,
                        max: 100,
                        colorMap: {
                            type: 'piecewise',
                            thresholds: [50, 85],
                            colors: ['#d32f2f', '#78909c', '#1976d2'],
                        },
                        valueFormatter: (value) => `${value}%`,
                    },
                ]}
                yAxis={[
                    {
                        scaleType: 'band',
                        dataKey: 'modelCode',
                        width: 140,
                    },
                ]}
                barLabel={(v) => `${v.value}%`}
                slots={{
                    legend: PiecewiseColorLegend,
                    barLabel: BarLabelAtBase,
                    bar: BarShadedBackground,
                }}
                slotProps={{
                    legend: {
                        axisDirection: 'x',
                        markType: 'square',
                        labelPosition: 'inline-start',
                        labelFormatter: ({ index }) => {
                            if (index === 0) return 'low utilization';
                            if (index === 1) return 'average';
                            return 'high utilization';
                        },
                    },
                }}
            />
        </Box>
    );
}

export function BarShadedBackground(props) {
    const { ownerState, skipAnimation, id, dataIndex, xOrigin, yOrigin, ...other } = props;
    const theme = useTheme();

    const animatedProps = useAnimateBar(props);
    const { width } = useDrawingArea();
    return (
        <React.Fragment>
            <rect
                {...other}
                fill={(theme.vars || theme).palette.text.primary}
                opacity={theme.palette.mode === 'dark' ? 0.05 : 0.1}
                x={other.x}
                width={width}
            />
            <rect
                {...other}
                filter={ownerState.isHighlighted ? 'brightness(120%)' : undefined}
                opacity={ownerState.isFaded ? 0.3 : 1}
                data-highlighted={ownerState.isHighlighted || undefined}
                data-faded={ownerState.isFaded || undefined}
                {...animatedProps}
            />
        </React.Fragment>
    );
}

const Text = styled('text')(({ theme }) => ({
    ...theme?.typography?.body2,
    stroke: 'none',
    fill: (theme.vars || theme).palette.common.white,
    transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
    textAnchor: 'start',
    dominantBaseline: 'central',
    pointerEvents: 'none',
    fontWeight: 600,
}));

function BarLabelAtBase(props) {
    const { xOrigin, y, height, skipAnimation, ...otherProps } = props;

    const animatedProps = useAnimate(
        { x: xOrigin + 8, y: y + height / 2 },
        {
            initialProps: { x: xOrigin, y: y + height / 2 },
            createInterpolator: interpolateObject,
            transformProps: (p) => p,
            applyProps: (element, p) => {
                element.setAttribute('x', p.x.toString());
                element.setAttribute('y', p.y.toString());
            },
            skip: skipAnimation,
        },
    );

    return <Text {...otherProps} {...animatedProps} />;
}
