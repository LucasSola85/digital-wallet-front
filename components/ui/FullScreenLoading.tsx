import { Box, CircularProgress } from "@mui/material"


export const FullScreenLoading = () => {
    return (
        <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            height='calc(100vh - 200px)'
            sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
        >
{/* 
            <Typography variant='h4' component='h1' sx={{ mr: 2 }}>
                Cargando...
            </Typography> */}

            <CircularProgress thickness={ 2 } />

        </Box>
    )
}
