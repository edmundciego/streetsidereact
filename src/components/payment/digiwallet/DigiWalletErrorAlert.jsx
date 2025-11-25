import { Alert, AlertTitle, Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const DigiWalletErrorAlert = ({ error, onRetry, onChangePayment }) => {
    const { t } = useTranslation();

    if (!error) return null;

    const severity = error.allowRetry ? 'warning' : 'error';

    return (
        <Alert severity={severity} sx={{ mt: 2 }}>
            <AlertTitle>
                {error.icon && <span style={{ marginRight: 8 }}>{error.icon}</span>}
                {t(error.title)}
            </AlertTitle>
            <Typography variant="body2" gutterBottom>
                {t(error.message)}
            </Typography>
            {error.action && (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
                    {t(error.action)}
                </Typography>
            )}

            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                {error.allowRetry && onRetry && (
                    <Button size="small" variant="outlined" onClick={onRetry}>
                        {t('Try Again')}
                    </Button>
                )}
                {error.status === 'INSUFFICIENT_FUNDS' && (
                    <Button
                        size="small"
                        variant="outlined"
                        href="https://digiwallet.bz/topup"
                        target="_blank"
                    >
                        {t('Top Up DigiWallet')}
                    </Button>
                )}
                {onChangePayment && (
                    <Button size="small" variant="text" onClick={onChangePayment}>
                        {t('Change Payment Method')}
                    </Button>
                )}
            </Stack>
        </Alert>
    );
};

export default DigiWalletErrorAlert;
