import { Box, Text, Ellipse, Group, Rect, Polygon } from "leafer-ui";
import { Flow } from "@leafer-in/flow";
import "@leafer-in/animate";
import { disk, cycle, speaker, infinity } from "../images";
const spectrumLevelBars = Array.from({ length: 15 }, () =>
    Array.from(
        { length: 22 },
        () =>
            new Group({
                children: [
                    new Rect({
                        width: 22,
                        height: 9,
                        fill: "#5a5d5a",
                    }),
                    new Rect({
                        x: 28,
                        width: 22,
                        height: 9,
                        fill: "#5a5d5a",
                    }),
                ],
            }),
    ),
);
const spectrum = new Flow({
    fill: "#FFF0",
    gap: 31,
    children: Array.from(
        { length: 15 },
        (_, col) =>
            new Flow({
                flow: "y",
                fill: "#FFF0",
                gap: 8,
                children: Array.from(
                    { length: 11 },
                    (_, row) =>
                        new Flow({
                            flow: "y",
                            gap: 4,
                            children: [
                                spectrumLevelBars[col][21 - row * 2],
                                spectrumLevelBars[col][21 - (row * 2 + 1)],
                            ],
                        }),
                ),
            }),
    ),
});
const spectrumAnalyzer = new Group({
    x: 0,
    y: 0,
    fill: "#FFF0",
    children: [
        new Text({
            x: 31,
            y: 17,
            fontFamily: "MensuraBoldW01-Regular",
            fontSize: 27,
            fill: "#ffba7a",
            text: "#SPECTRUM ANALYZER",
        }),
        new Flow({
            x: 25,
            y: 73,
            width: 1230,
            fill: "#FFF0",
            children: [
                new Flow({
                    fill: "#FFF0",
                    flow: "y",
                    flowAlign: "center",
                    gap: 8,
                    children: Array.from({ length: 11 }, (_, row) => {
                        if (row != 5) {
                            return new Box({
                                width: 26,
                                height: 22,
                                children: [
                                    new Ellipse({
                                        x: 13,
                                        y: 11,
                                        width: 7,
                                        height: 7,
                                        fill: "#fbba7a",
                                        around: "center",
                                    }),
                                ],
                            });
                        } else {
                            return new Box({
                                width: 26,
                                height: 22,
                                children: [
                                    new Ellipse({
                                        x: 13,
                                        y: 11,
                                        width: 7,
                                        height: 7,
                                        fill: "#f2483b",
                                        around: "center",
                                    }),
                                ],
                            });
                        }
                    }),
                }),
                new Box({
                    autoWidth: 1,
                    fill: "#FFF0",
                    children: [spectrum],
                }),
                new Flow({
                    fill: "#FFF0",
                    flow: "y",
                    flowAlign: "center",
                    gap: 8,
                    children: Array.from({ length: 11 }, (_, row) => {
                        if (row != 5) {
                            return new Box({
                                width: 26,
                                height: 22,
                                children: [
                                    new Ellipse({
                                        x: 21,
                                        y: 11,
                                        width: 7,
                                        height: 7,
                                        fill: "#fbba7a",
                                        around: "center",
                                    }),
                                ],
                            });
                        } else {
                            return new Box({
                                width: 26,
                                height: 22,
                                children: [
                                    new Ellipse({
                                        x: 21,
                                        y: 11,
                                        width: 7,
                                        height: 7,
                                        fill: "#f2483b",
                                        around: "center",
                                    }),
                                ],
                            });
                        }
                    }),
                }),
            ],
        }),
        new Flow({
            x: 51,
            y: 408,
            gap: 31,
            children: Array.from(
                { length: 15 },
                () =>
                    new Box({
                        width: 50,
                        height: 30,
                        children: [
                            new Ellipse({
                                x: 25,
                                y: 15,
                                width: 7,
                                height: 7,
                                fill: "#fbba7a",
                                around: "center",
                            }),
                        ],
                    }),
            ),
        }),
    ],
});
const play = [
    new Box({
        children: [
            new Rect({
                width: 14,
                height: 45,
                fill: "#c4ecf2",
            }),
            new Rect({
                x: 22,
                width: 14,
                height: 45,
                fill: "#c4ecf2",
            }),
        ],
        visible: false,
    }),
    new Polygon({
        width: 45,
        height: 45,
        sides: 3,
        fill: "#c4ecf2",
        origin: "center",
        rotation: -30,
    }),
];
const progressBar = new Group({
    x: 1070,
    children: [
        new Polygon({
            points: [-6, 33, 31, 33, 43, 4, 6, 4],
            fill: "#ffffff64",
        }),
        new Polygon({
            x: 48,
            points: [-6, 33, 31, 33, 43, 4, 6, 4],
            fill: "#ffffff64",
        }),
        new Polygon({
            x: 96,
            points: [-6, 33, 31, 33, 43, 4, 6, 4],
            fill: "#ffffff64",
        }),
    ],
});
const diskPanel = new Box({
    x: 566,
    width: 77,
    height: 45,
    strokeWidth: 2,
    stroke: {
        type: "solid",
        color: "#74a3a3",
    },
    children: [
        new Rect({
            x: 22,
            y: 22,
            width: 27,
            height: 27,
            fill: [
                {
                    type: "image",
                    url: disk,
                    mode: "stretch",
                },
            ],
            origin: "center",
            around: "center",
        }),
        new Rect({
            x: 55,
            y: 22,
            width: 27,
            height: 27,
            fill: {
                type: "image",
                url: disk,
                mode: "stretch",
            },
            origin: "center",
            around: "center",
        }),
    ],
});
const control = new Group({
    x: 37,
    y: 475,
    children: [
        new Box({
            width: 117,
            height: 45,
            stroke: {
                type: "solid",
                color: "#74a3a3",
            },
            strokeWidth: 2,
            children: [
                new Text({
                    x: 58.5,
                    y: 22.5,
                    letterSpacing: -2,
                    fill: "#74a3a3",
                    fontSize: 26,
                    fontFamily: "TT Lakes Neue Trial Medium",
                    text: "STEREO",
                    around: "center",
                }),
            ],
        }),
        new Box({
            x: 134,
            width: 117,
            height: 45,
            stroke: {
                type: "solid",
                color: "#b20000",
            },
            strokeWidth: 2,
            children: [
                new Text({
                    x: 58.5,
                    y: 22.5,
                    letterSpacing: -2,
                    fill: "#b20000",
                    fontSize: 26,
                    fontFamily: "TT Lakes Neue Trial Medium",
                    text: "TYPE IV",
                    around: "center",
                }),
            ],
        }),
        new Rect({
            x: 290,
            width: 67,
            height: 45,
            fill: {
                type: "image",
                url: cycle,
                mode: "stretch",
            },
        }),
        new Group({
            x: 450,
            children: [play],
        }),
        diskPanel,
        new Text({
            x: 870,
            letterSpacing: -2,
            fill: "#99c5c5",
            fontSize: 26,
            fontFamily: "TT Lakes Neue Trial Light",
            text: "AUTO",
        }),
        new Text({
            x: 950,
            letterSpacing: -2,
            fill: "#99c5c5",
            fontSize: 26,
            fontFamily: "TT Lakes Neue Trial Medium",
            text: "MANUAL",
        }),
        progressBar,
    ],
});
const peakprogramMeterLevelBarL = new Flow({
    x: 60,
    y: 91,
    gap: 4,
    height: 46,
    around: "left",
    children: Array.from(
        { length: 116 },
        () =>
            new Rect({
                width: 4,
                height: 46,
                fill: "#c4ecf2",
                visible: false,
            }),
    ),
});
const peakprogramMeterLevelBarR = new Flow({
    x: 60,
    y: 207,
    gap: 4,
    height: 46,
    around: "left",
    children: Array.from(
        { length: 116 },
        () =>
            new Rect({
                width: 4,
                height: 46,
                fill: "#c4ecf2",
                visible: false,
            }),
    ),
});
const peakprogramMeter = new Group({
    x: 25,
    y: 530,
    children: [
        new Rect({
            x: 12,
            y: 26,
            width: 12,
            height: 12,
            fill: "#d2dbd9",
        }),
        new Text({
            x: 33,
            y: 10,
            fontSize: 28,
            fontFamily: "Novecentowide-Normal",
            fill: "#d2dbd9",
            text: "PEAKPROGRAM METER",
        }),
        new Text({
            x: 23,
            y: 64,
            fontSize: 38,
            fontFamily: "cmdysj",
            fill: "#d2dbd9",
            text: "L",
        }),
        new Rect({
            x: 30.5,
            y: 150,
            width: 31,
            height: 30,
            fill: {
                type: "image",
                url: speaker,
                mode: "stretch",
            },
            around: "center",
        }),
        new Text({
            x: 23,
            y: 180,
            fontSize: 38,
            fontFamily: "cmdysj",
            fill: "#d2dbd9",
            text: "R",
        }),
        new Flow({
            x: 52,
            y: 150,
            height: 32,
            gap: 36,
            around: "left",
            flowAlign: "center",
            children: Array.from({ length: 15 }, (_, k) => {
                const box = new Box({
                    width: 39,
                    height: 32,
                });
                if (k == 0) {
                    box.add([
                        new Text({
                            x: 4.5,
                            y: 16,
                            fontSize: 26,
                            fontFamily: "Bebas-Regular",
                            fill: "#d2dbd9",
                            text: "-",
                            around: "left",
                        }),
                        new Rect({
                            x: 14.5,
                            y: 16,
                            width: 22,
                            height: 12,
                            fill: {
                                type: "image",
                                url: infinity,
                                mode: "stretch",
                            },
                            around: "left",
                        }),
                    ]);
                    return box;
                }
                const text = [
                    "-20",
                    "-15",
                    "-10",
                    "-7",
                    "-5",
                    "-3",
                    "-1",
                    "0",
                    "+1",
                    "+3",
                    "+5",
                    "+7",
                ];
                if (k >= 1 && k <= 7) {
                    box.add(
                        new Text({
                            x: 19.5,
                            y: 16,
                            fontSize: 26,
                            fontFamily: "Bebas-Regular",
                            fill: "#d2dbd9",
                            text: text[k - 1],
                            around: "center",
                        }),
                    );
                    return box;
                }
                if (k >= 8 && k <= 14) {
                    box.add(
                        new Text({
                            x: 19.5,
                            y: 16,
                            fontSize: 26,
                            fontFamily: "Bebas-Regular",
                            fill: "#ff0000",
                            text: text[k - 1],
                            around: "center",
                        }),
                    );
                    return box;
                }
            }),
        }),
        peakprogramMeterLevelBarL,
        peakprogramMeterLevelBarR,
    ],
});
export const elements = new Group({
    children: [spectrumAnalyzer, control, peakprogramMeter],
});

export function setSpectrumLevelBars(freq, energy) {
    for (var i = 0; i < 22; i++) {
        if (i < energy) {
            spectrumLevelBars[freq][i].children[0].fill = "#ffba7a";
            spectrumLevelBars[freq][i].children[1].fill = "#ffba7a";
        } else {
            spectrumLevelBars[freq][i].children[0].fill = "#5a5d5a";
            spectrumLevelBars[freq][i].children[1].fill = "#5a5d5a";
        }
    }
}
var diskRotation = [0, 0];
export function setPlayStatus(status) {
    if (status) {
        play[0].visible = true;
        play[1].visible = false;
        diskPanel.children[0].animate(
            { rotation: diskRotation[0] + 360 },
            { duration: 2, loop: true, easing: "linear", join: true },
        );
        diskPanel.children[1].animate(
            { rotation: diskRotation[1] + 360 },
            { duration: 2, loop: true, easing: "linear", join: true },
        );
    } else {
        play[0].visible = false;
        play[1].visible = true;
        diskRotation = [
            diskPanel.children[0].rotation,
            diskPanel.children[1].rotation,
        ];
        diskPanel.children[0].killAnimate();
        diskPanel.children[1].killAnimate();
        diskPanel.children[0].rotation = diskRotation[0];
        diskPanel.children[1].rotation = diskRotation[1];
    }
}
export function setProgressBar(progress) {
    for (var i = 0; i < 3; i++) {
        if (i < progress) {
            progressBar.children[i].fill = "#FFF";
        } else {
            progressBar.children[i].fill = "#ffffff64";
        }
    }
}
export function setPeakprogramMeterLevelBar(side, energy) {
    if (side == "L") {
        for (var i = 0; i < 116; i++) {
            if (i < energy) {
                peakprogramMeterLevelBarL.children[i].visible = true;
            } else {
                peakprogramMeterLevelBarL.children[i].visible = false;
            }
        }
    } else if (side == "R") {
        for (var i = 0; i < 116; i++) {
            if (i < energy) {
                peakprogramMeterLevelBarR.children[i].visible = true;
            } else {
                peakprogramMeterLevelBarR.children[i].visible = false;
            }
        }
    }
}
