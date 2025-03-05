import os
import logging
from app import create_app

# logging configuration provides information about server startup and database connection status
# Needed for debugging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    host = os.environ.get('HOST', '0.0.0.0')
    debug = os.environ.get('FLASK_ENV') == 'development'

    logger.info(f"Starting server on {host}:{port} with debug={debug}")
    logger.info(f"PostgreSQL database connection configured")

    try:
        app.run(debug=debug, host=host, port=port)
    except Exception as e:
        logger.error(f"Error starting server: {e}")
