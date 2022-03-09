import React, {Component} from 'react';
import {
    Box,
    Button, Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from "@mui/material";


const hourSet = [6, 7, 8, 9, 10 , 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
const minSet = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 , 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59] ;

interface State {
    endHour: number;        // 종료 시간의 시(24h)
    endMin: number;         // 종료 시간의 분
    minInterval: number;    // 분 단위의 간격(몇 분마다 알람이 울리도록 할 것인지)
    isRunning: boolean;
    interval: any;
    current: string;
    nextTime: string;
}

class MainPage extends Component<{}, State> {
    //
    state: State = {
        endHour: 22,
        endMin: 0,
        minInterval: 1,
        isRunning: false,
        interval: undefined,
        current: `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
        nextTime: 'none',
    };

    audioRef;

    constructor(props: {}) {
        super(props);
        this.audioRef = React.createRef<HTMLAudioElement>();
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({ current: `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}` });
        }, 1000);
    }

    handleClick() {
        const { isRunning, minInterval, endHour, endMin } = this.state;

        this.setState({ isRunning: !isRunning }, () => {
            if (this.state.isRunning) {
                this.audioRef.current?.play();
                this.setState({ nextTime: this.getNextTime() });
                this.setState({ interval: setInterval(() => {
                    this.audioRef.current?.play();
                    this.setState({ nextTime: this.getNextTime() });
                    if (new Date().getHours() >= endHour && new Date().getMinutes() >= endMin) {
                        clearInterval(this.state.interval);
                        this.setState({ isRunning: false });
                        this.setState({ nextTime: 'none' });
                    }
                }, minInterval*60*1000)});
            }
            else {
                clearInterval(this.state.interval);
                this.setState({ nextTime: 'none' });
            }
        });
    }

    handleEndHourSelect(event: SelectChangeEvent) {
        //
        if (new Date().getHours() > this.resolveStringToNumber(event.target.value as string)) {
            alert(`현재시간(${new Date().getHours()}시 ${new Date().getMinutes()}분)보다 작은 값을 선택할 수 없습니다.`);
            return;
        }
        this.setState({ endHour: this.resolveStringToNumber(event.target.value as string) });
    }

    handleEndMinSelect(event: SelectChangeEvent) {
        //
        const { endHour } = this.state;

        if (new Date().getHours() === endHour && new Date().getMinutes() > this.resolveStringToNumber(event.target.value as string)) {
            alert(`현재시간(${new Date().getHours()}시 ${new Date().getMinutes()}분)보다 작은 값을 선택할 수 없습니다.`);
            return;
        }
        this.setState({ endMin: this.resolveStringToNumber(event.target.value as string) });
    }

    handleMinIntervalSelect(event: SelectChangeEvent) {
        //
        this.setState({ minInterval: Number(event.target.value) });
    }

    resolveStringToNumber(str: string): number {
        //
        return str[0] === '0' ? Number(str[1]) : Number(str);
    }

    getNextTime(): string {
        const { minInterval } = this.state;

        const currentHour = new Date().getHours();
        const currentMin = new Date().getMinutes();

        let nextHour;
        let nextMin;

        if( currentMin + minInterval > 59) {
            nextHour = currentHour + 1;
            nextMin = currentMin + minInterval - 60;
        } else {
            nextHour = currentHour;
            nextMin = currentMin + minInterval;
        }

        return `${nextHour}:${nextMin}:${new Date().getSeconds()}`;

    }

    render() {
        //
        const { endHour, endMin, minInterval, isRunning, current, nextTime } = this.state;

        return (
            <Box width="100%" height="100vh" display="flex" alignItems="center" justifyContent="center" flexDirection="column" mt={17}>
                <img src="bong.gif" style={{ width: '200px', position: 'relative', top: '140px', left: '80px' }}/>
                <Box width="275px" display="flex" justifyContent="flex-start" flexDirection="column" mb={2}>
                    <Chip variant="outlined" style={{ width: 'fit-content', justifyContent: 'flex-start', marginBottom: '10px' }} label={`현재 시간 ⚡ ${current}`}/>
                    <Chip style={{ width: 'fit-content', justifyContent: 'flex-start' }} label={`다음 알림 ⚡ ${nextTime}`}/>
                </Box>

                <Box display="flex" alignItems="center" justifyContent="flex-start" width="275px">
                    <Typography>종료:&nbsp;&nbsp;&nbsp;</Typography>
                    <FormControl style={{ width: '100px' }}>
                        <InputLabel id="demo-simple-select-label">시</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={endHour}
                            label="시"
                            onChange={(e) => this.handleEndHourSelect(e as SelectChangeEvent<string>)}
                        >
                            {
                                hourSet.map((hour) =>
                                    <MenuItem key={hour} value={hour}>{hour > 9 ? hour : `0${hour}`}</MenuItem>
                                )
                            }
                        </Select>
                    </FormControl>
                    <FormControl style={{ width: '100px', margin: '10px' }}>
                        <InputLabel id="demo-simple-select-label">분</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={endMin}
                            label="분"
                            onChange={(e) => this.handleEndMinSelect(e as SelectChangeEvent<string>)}
                        >
                            {
                                minSet.map((min) =>
                                    <MenuItem key={min} value={min}>{min > 9 ? min : `0${min}`}</MenuItem>
                                )
                            }
                        </Select>
                    </FormControl>
                </Box>

                <Box display="flex" alignItems="center" justifyContent="flex-start" width="275px">
                    <Typography>간격:&nbsp;&nbsp;&nbsp;</Typography>
                    <FormControl style={{ width: '210px' }}>
                        <InputLabel id="demo-simple-select-label">분</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={minInterval}
                            label="분"
                            onChange={(e) => this.handleMinIntervalSelect(e as SelectChangeEvent<string>)}
                        >
                            {
                                minSet.concat(60).map((min) =>
                                    min > 0 && <MenuItem key={min} value={min}>{min}</MenuItem>
                                )
                            }
                        </Select>
                    </FormControl>
                </Box>

                <Box width="275px" display="flex" justifyContent="flex-start" mt={2} mb={10}>
                    <Button onClick={this.handleClick.bind(this)} style={{ width: '260px', height: '60px' }} variant="contained" color={isRunning ? 'secondary' : 'primary'}>{isRunning ? 'STOP' : 'START'}</Button>
                </Box>

                <img src="bong.jpg" style={{ width: '270px', position: 'relative', top: '-600px' }} />

                <audio ref={this.audioRef} src="ding.mp3">audio failed</audio>
            </Box>
        );
    }
}

export default MainPage;
