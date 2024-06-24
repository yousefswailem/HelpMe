// src/components/TaskForm.js
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, MenuItem, Grid } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';




const addressOptions = [
    { key: 'بلدية البيرة', value: 'بلدية البيرة', lon: '31.95', lat: '35.21167' },
    { key: 'البيرة إسعاد الطفولة', value: 'البيرة إسعاد الطفولة', lon: '35.212888', lat: '31.904137' },
    { key: 'البيرة المدرسة الهاشمية', value: 'البيرة المدرسة الهاشمية', lon: '35.223305', lat: '31.907753' },
    { key: 'الشرفة', value: 'الشرفة', lon: '31.898553328450234', lat: '35.21238381349182' },
    { key: 'ام الشرايط', value: 'ام الشرايط', lat: '31.912379', lon: '35.222007' },
    { key: 'شارع نابلس', value: 'شارع نابلس' },
    { key: 'شارع القدس', value: 'شارع القدس' },
    { key: 'البيرة حي الجنان', value: 'البيرة حي الجنان' },
    { key: 'البالوع', value: 'البالوع' },
    { key: 'البيرة المنطقة الصناعية', value: 'البيرة المنطقة الصناعية' },
    { key: 'وسط البلد', value: 'وسط البلد' },
    { key: 'رام الله التحتا', value: 'رام الله التحتا' },
    { key: 'الماصيون', value: 'الماصيون' },
    { key: 'عين منجد', value: 'عين منجد' },
    { key: 'بطن الهوا', value: 'بطن الهوا' },
    { key: 'عين مصباح', value: 'عين مصباح' },
    { key: 'المصايف', value: 'المصايف' },
    { key: 'الارسال', value: 'الارسال' },
    { key: 'سميراميس', value: 'سميراميس' },
    { key: 'سطح مرحبا', value: 'سطح مرحبا' },
    { key: 'دوار رافات', value: 'دوار رافات' },
    { key: 'شارع بيت ايل', value: 'شارع بيت ايل' },
    { key: 'الطيرة', value: 'الطيرة' },
    { key: 'بيتونيا الصناعة', value: 'بيتونيا الصناعة' },
    { key: 'بيتونيا السنابل', value: 'بيتونيا السنابل' },
    { key: 'بيتونيا مخماس', value: 'بيتونيا مخماس' },
    { key: 'بيتونيا مفرق الحتو', value: 'بيتونيا مفرق الحتو' },
    { key: 'بيتونيا دوار الفواكه', value: 'بيتونيا دوار الفواكه' },
    { key: 'بيتونيا دوار المدارس', value: 'بيتونيا دوار المدارس' },
    { key: 'ضاحية التربية', value: 'ضاحية التربية' },
    { key: 'سردا', value: 'سردا' },
    { key: 'كفرعقب', value: 'كفرعقب' },
    { key: 'حي الدبلوماسي', value: 'حي الدبلوماسي' },
    { key: 'بيتونيا مفرق 17', value: 'بيتونيا مفرق 17' },
    { key: 'بيتونيا البلدة القديمة', value: 'بيتونيا البلدة القديمة' },
    { key: 'بيتونيا شارع المعبر', value: 'بيتونيا شارع المعبر' },
    { key: 'بيتونيا البالوع', value: 'بيتونيا البالوع' },
    { key: 'رافات', value: 'رافات' },
    { key: 'ضاحية الزراعة', value: 'ضاحية الزراعة' },
    { key: 'أبوقش', value: 'أبوقش' },
    { key: 'الريحان', value: 'الريحان' },
    { key: 'ضاحية الغدير', value: 'ضاحية الغدير' },
    { key: 'عين قينيا', value: 'عين قينيا' },
    { key: 'بيرزيت', value: 'بيرزيت' },
    { key: 'بيرنبالا', value: 'بيرنبالا' },
    { key: 'قلنديا البلد', value: 'قلنديا البلد' },
    { key: 'الجلزون', value: 'الجلزون' },
    { key: 'الجديرة', value: 'الجديرة' },
    { key: 'مخيم قلنديا', value: 'مخيم قلنديا' },
    { key: 'الجيب', value: 'الجيب' },
    { key: 'كوبر', value: 'كوبر' },
    { key: 'أبو شخيدم', value: 'أبو شخيدم' },
    { key: 'المزرعة الغربية', value: 'المزرعة الغربية' },
    { key: 'برهام', value: 'برهام' },
    { key: 'جيبيا', value: 'جيبيا' },
    { key: 'جفنا', value: 'جفنا' },
    { key: 'عين سينيا', value: 'عين سينيا' },
    { key: 'عطارة', value: 'عطارة' },
    { key: 'دورا القرع', value: 'دورا القرع' },
    { key: 'بيتين', value: 'بيتين' },
    { key: 'الرام', value: 'الرام' },
    { key: 'روابي', value: 'روابي' },
    { key: 'ام صفا', value: 'ام صفا' },
    { key: 'عين يبرود', value: 'عين يبرود' },
    { key: 'دير دبوان', value: 'دير دبوان' },
    { key: 'دير السودان', value: 'دير السودان' },
    { key: 'ترمسعيا', value: 'ترمسعيا' },
    { key: 'سنجل', value: 'سنجل' },
    { key: 'أبو فلاح', value: 'أبو فلاح' },
    { key: 'النبي صالح', value: 'النبي صالح' },
    { key: 'عارورة', value: 'عارورة' },
    { key: 'يبرود', value: 'يبرود' },
    { key: 'المغير', value: 'المغير' },
    { key: 'بيت ريما', value: 'بيت ريما' },
    { key: 'دير غسانة', value: 'دير غسانة' },
    { key: 'عابود', value: 'عابود' },
    { key: 'قراوة بني زيد', value: 'قراوة بني زيد' },
    { key: 'عبوين', value: 'عبوين' },
    { key: 'سلواد', value: 'سلواد' },
    { key: 'دير ابو مشعل', value: 'دير ابو مشعل' },
    { key: 'المزرعة الشرقية', value: 'المزرعة الشرقية' },
    { key: 'دير جرير', value: 'دير جرير' },
    { key: 'كفر مالك', value: 'كفر مالك' },
    { key: 'الطيبة', value: 'الطيبة' },
    { key: 'رمون', value: 'رمون' },
    { key: 'تل النصبة', value: 'تل النصبة' },
    { key: 'الارسال بعد البيست ايسترن', value: 'الارسال بعد البيست ايسترن' }
]


const TaskForm = () => {
    const [device, setDevice] = useState('');
    const [priority, setPriority] = useState('');
    const [startDateTime, setStartDateTime] = useState(dayjs());
    const [endDateTime, setEndDateTime] = useState(dayjs());
    const [deliveryStartDateTime, setDeliveryStartDateTime] = useState(dayjs());
    const [deliveryEndDateTime, setDeliveryEndDateTime] = useState(dayjs());
    const [homeAddress, setHomeAddress] = useState('');
    const [shopAddress, setShopAddress] = useState('BBQ Pizza - Al-Bireh');

    const handleDeviceChange = (event) => {
        setDevice(event.target.value);
    };

    const handlePriorityChange = (event) => {
        setPriority(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form submitted');
    };

    const handleHomeAddressChange = (event) => {
        setHomeAddress(event.target.value);
    };

    const handleShopAddressChange = (event) => {
        setShopAddress(event.target.value);
    };

    return (
        <Container maxWidth="md" sx={{ bgcolor: 'gray', color: 'white', padding: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
                مهمة جديدة
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={9}>
                        <TextField
                            select
                            label="جهاز"
                            value={device}
                            onChange={handleDeviceChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            sx={{ bgcolor: 'white' }}
                        >
                            <MenuItem value="">
                                <em>-- حدد --</em>
                            </MenuItem>
                            <MenuItem value="Device1">جهاز 1</MenuItem>
                            <MenuItem value="Device2">جهاز 2</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            label="رقم الفاتورة"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            sx={{ bgcolor: 'white' }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        <TextField
                            label="العنوان"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            sx={{ bgcolor: 'white' }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            select
                            label="أفضلية"
                            value={priority}
                            onChange={handlePriorityChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            sx={{ bgcolor: 'white' }}
                        >
                            <MenuItem value="High">أولوية عالية</MenuItem>
                            <MenuItem value="Medium">أولوية متوسطة</MenuItem>
                            <MenuItem value="Low">أولوية منخفضة</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography>عنوان الاستلام:</Typography>
                        <TextField
                            label="عنوان المحل"
                            value={shopAddress}
                            onChange={handleShopAddressChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            sx={{ bgcolor: 'white' }}
                            disabled
                        >
                            <p> {shopAddress}</p>

                        </TextField>
                        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="من"
                                value={startDateTime}
                                onChange={setStartDateTime}
                                renderInput={(params) => <TextField {...params} fullWidth variant="outlined" margin="normal" sx={{ bgcolor: 'white' }} />}
                            />
                            <DateTimePicker
                                label="الى"
                                value={endDateTime}
                                onChange={setEndDateTime}
                                renderInput={(params) => <TextField {...params} fullWidth variant="outlined" margin="normal" sx={{ bgcolor: 'white' }} />}
                            />
                        </LocalizationProvider> */}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography>عنوان التسليم:</Typography>
                        <TextField
                            select
                            label="عنوان المنزل"
                            value={homeAddress}
                            onChange={handleHomeAddressChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            sx={{ bgcolor: 'white' }}
                        >
                            {addressOptions.map(option => (
                                <MenuItem key={option.key} value={option.value}>
                                    {option.value}
                                </MenuItem>
                            ))}
                        </TextField>
                        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="من"
                                value={deliveryStartDateTime}
                                onChange={setDeliveryStartDateTime}
                                renderInput={(params) => <TextField {...params} fullWidth variant="outlined" margin="normal" sx={{ bgcolor: 'white' }} />}
                            />
                            <DateTimePicker
                                label="الى"
                                value={deliveryEndDateTime}
                                onChange={setDeliveryEndDateTime}
                                renderInput={(params) => <TextField {...params} fullWidth variant="outlined" margin="normal" sx={{ bgcolor: 'white' }} />}
                            />
                        </LocalizationProvider> */}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="تعليق"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            multiline
                            rows={4}
                            sx={{ bgcolor: 'white' }}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: 'center' }}>
                        <Button variant="contained" color="primary" type="submit">
                            إرسال
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container >
    );
};

export default TaskForm;
