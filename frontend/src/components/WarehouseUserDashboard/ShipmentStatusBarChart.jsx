import * as React from "react";
import { useEffect, useState } from "react";
import { useTheme, styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { BarChart } from "@mui/x-charts/BarChart";
import { useAnimate, useAnimateBar, useDrawingArea } from "@mui/x-charts/hooks";
import { PiecewiseColorLegend } from "@mui/x-charts/ChartsLegend";
import { interpolateObject } from "@mui/x-charts-vendor/d3-interpolate";
import APIS, { privateApi } from "../../apis.js";

const Text = styled("text")(({ theme }) => ({
    ...theme?.typography?.body2,
    stroke: "none",
    fill: (theme.vars || theme).palette.common.white,
    transition: "opacity 0.2s ease-in, fill 0.2s ease-in",
    textAnchor: "start",
    dominantBaseline: "central",
    pointerEvents: "none",
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
                element.setAttribute("x", p.x.toString());
                element.setAttribute("y", p.y.toString());
            },
            skip: skipAnimation,
        }
    );

    return <Text {...otherProps} {...animatedProps} />;
}

export function BarShadedBackground(props) {
    const { ownerState, skipAnimation, ...other } = props;
    const theme = useTheme();
    const animatedProps = useAnimateBar(props);
    const { width } = useDrawingArea();

    return (
        <React.Fragment>
            <rect
                {...other}
                fill={(theme.vars || theme).palette.text.primary}
                opacity={theme.palette.mode === "dark" ? 0.05 : 0.1}
                x={other.x}
                width={width}
            />
            <rect
                {...other}
                filter={ownerState.isHighlighted ? "brightness(120%)" : undefined}
                opacity={ownerState.isFaded ? 0.3 : 1}
                data-highlighted={ownerState.isHighlighted || undefined}
                data-faded={ownerState.isFaded || undefined}
                {...animatedProps}
            />
        </React.Fragment>
    );
}

export default function ShipmentStatusBarChart({ warehouseId }) {
    const theme = useTheme();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data } = await privateApi.get(`${APIS.getShipmentStats}/${warehouseId}`);
                const chartData = [
                    { status: "PENDING", count: data.pendingShipments || 0 },
                    { status: "OPTIMIZED", count: data.optimizedShipments || 0 },
                    { status: "BOOKED", count: data.bookedShipments || 0 },
                    { status: "IN-TRANSIT", count: data.ongoingShipments || 0 },
                    { status: "DELIVERED", count: data.totalTrips || 0 },
                ];
                setData(chartData);
            } catch (err) {
                console.error(err);
                setError("Failed to load shipment stats");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [warehouseId]);

    if (loading) return <div className="text-gray-600 p-4">Loading chart...</div>;
    if (error) return <div className="text-red-600 p-4">{error}</div>;

    return (
        <Box width="100%">
            <Typography marginBottom={2} marginLeft={3} variant="h6">
                Shipment Status Overview
            </Typography>
            <BarChart
                height={300}
                dataset={data}
                series={[
                    {
                        id: "shipments",
                        dataKey: "count",
                        stack: "status",
                        valueFormatter: (value) => `${value}`,
                    },
                ]}
                layout="horizontal"
                xAxis={[
                    {
                        id: "color",
                        min: 0,
                        max: Math.max(...data.map((d) => d.count)) * 1.2,
                        colorMap: {
                            type: "piecewise",
                            thresholds: [1, 5],
                            colors: ["#f44336", "#ffb300", "#4caf50"],
                        },
                        valueFormatter: (value) => value.toString(),
                    },
                ]}
                yAxis={[
                    {
                        scaleType: "band",
                        dataKey: "status",
                        width: 140,
                    },
                ]}
                barLabel={(v) => `${v.value}`}
                slots={{
                    legend: PiecewiseColorLegend,
                    barLabel: BarLabelAtBase,
                    bar: BarShadedBackground,
                }}
                slotProps={{
                    legend: {
                        axisDirection: "x",
                        markType: "square",
                        labelPosition: "inline-start",
                    },
                }}
            />
        </Box>
    );
}
