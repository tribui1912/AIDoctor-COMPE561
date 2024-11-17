from datetime import datetime, timedelta
from app.database import SessionLocal
from app.models import NewsArticle
from sqlalchemy.exc import SQLAlchemyError

news_articles = [
    {
        "title": "Breakthrough in Cancer Treatment: New Immunotherapy Shows Promise",
        "summary": "Researchers have developed a novel immunotherapy approach that shows significant results in treating aggressive forms of cancer.",
        "content": """A groundbreaking study conducted at City General Hospital has revealed promising results in cancer treatment using a new immunotherapy approach. The treatment, which enhances the body's natural immune response to cancer cells, has shown an 80% success rate in early trials.

The research team, led by Dr. Sarah Chen, focused on developing a personalized immunotherapy protocol that adapts to each patient's specific cancer profile. "This breakthrough could revolutionize how we treat cancer," says Dr. Chen. "We're seeing remarkable results with minimal side effects."

The study included 100 patients with various forms of aggressive cancer, and the results have been particularly encouraging in cases of lymphoma and melanoma.""",
        "category": "Research",
        "image_url": "https://images.pexels.com/photos/3376790/pexels-photo-3376790.jpeg",
        "date": datetime.utcnow() - timedelta(days=2),
        "status": "published",
        "admin_id": 1
    },
    {
        "title": "New AI System Detects Early Signs of Alzheimer's",
        "summary": "City General Hospital implements cutting-edge AI technology for early detection of Alzheimer's disease.",
        "content": """Our hospital has successfully implemented a new artificial intelligence system that can detect early signs of Alzheimer's disease with unprecedented accuracy. The AI system analyzes brain scans and patient data to identify patterns associated with early-stage Alzheimer's.

The system has already helped identify several cases that might have otherwise gone unnoticed until more severe symptoms developed. Early detection is crucial for managing Alzheimer's and improving patient outcomes.""",
        "category": "Technology",
        "image_url": "https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg",
        "date": datetime.utcnow() - timedelta(days=5),
        "status": "published",
        "admin_id": 1
    },
    {
        "title": "Hospital Launches New Pediatric Wing",
        "summary": "State-of-the-art pediatric facility opens at City General Hospital, expanding children's healthcare services.",
        "content": """City General Hospital is proud to announce the opening of our new pediatric wing, featuring advanced medical equipment and child-friendly spaces designed to make young patients feel more comfortable during their stay.

The new facility includes 50 private rooms, a specialized pediatric ICU, and an interactive play area. The wing also features a dedicated team of pediatric specialists and child life specialists.""",
        "category": "Facility Update",
        "image_url": "https://images.pexels.com/photos/3259624/pexels-photo-3259624.jpeg",
        "date": datetime.utcnow() - timedelta(days=7),
        "status": "published",
        "admin_id": 1
    },
    {
        "title": "Revolutionary Heart Surgery Technique Developed",
        "summary": "Cardiac surgeons at City General pioneer minimally invasive heart surgery technique.",
        "content": """Our cardiac surgery team has developed a new minimally invasive technique for heart valve replacement that significantly reduces recovery time and complications. The procedure uses advanced robotics and 3D imaging technology to achieve precise results with smaller incisions.

Initial procedures using this technique have shown excellent outcomes, with patients experiencing shorter hospital stays and faster recovery times.""",
        "category": "Surgery",
        "image_url": "https://images.pexels.com/photos/3376790/pexels-photo-3376790.jpeg",
        "date": datetime.utcnow() - timedelta(days=10),
        "status": "published",
        "admin_id": 1
    },
    {
        "title": "COVID-19 Long-Term Study Results Released",
        "summary": "New research reveals important findings about long-term effects of COVID-19.",
        "content": """A comprehensive study conducted at City General Hospital has revealed new insights into the long-term effects of COVID-19. The research, which followed 500 patients over two years, identified several previously unknown patterns in long COVID cases.

The study highlights the importance of continued monitoring and support for COVID-19 survivors, and has led to the development of new treatment protocols.""",
        "category": "Research",
        "image_url": "https://images.pexels.com/photos/3992933/pexels-photo-3992933.jpeg",
        "date": datetime.utcnow() - timedelta(days=12),
        "status": "published",
        "admin_id": 1
    },
    {
        "title": "Mental Health Program Expansion",
        "summary": "Hospital doubles capacity of mental health services to meet growing community needs.",
        "content": """In response to increasing demand for mental health services, City General Hospital has expanded its mental health program, doubling the number of available beds and adding new specialized treatment options.

The expansion includes new facilities for group therapy, art therapy, and meditation, as well as additional staff trained in the latest mental health treatment approaches.""",
        "category": "Mental Health",
        "image_url": "https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg",
        "date": datetime.utcnow() - timedelta(days=15),
        "status": "published",
        "admin_id": 1
    },
    {
        "title": "Innovative Diabetes Management System Launched",
        "summary": "New digital platform helps patients better manage their diabetes care.",
        "content": """City General Hospital has launched a new digital platform for diabetes management, allowing patients to track their blood sugar levels, medication, and lifestyle factors all in one place. The system also enables real-time communication with healthcare providers.

The platform has already shown promising results in helping patients maintain better control of their condition.""",
        "category": "Technology",
        "image_url": "https://images.pexels.com/photos/4226119/pexels-photo-4226119.jpeg",
        "date": datetime.utcnow() - timedelta(days=18),
        "status": "published",
        "admin_id": 1
    },
    {
        "title": "Breakthrough in Pain Management Research",
        "summary": "New study reveals promising alternative to opioids for chronic pain management.",
        "content": """Researchers at City General Hospital have identified a new approach to managing chronic pain that could provide an alternative to opioid medications. The study focused on combining physical therapy with targeted nerve stimulation.

The results show significant pain reduction without the risks associated with opioid use. This breakthrough could help address the ongoing opioid crisis while providing effective pain relief.""",
        "category": "Research",
        "image_url": "https://images.pexels.com/photos/4226264/pexels-photo-4226264.jpeg",
        "date": datetime.utcnow() - timedelta(days=20),
        "status": "published",
        "admin_id": 1
    },
    {
        "title": "Emergency Department Modernization Complete",
        "summary": "Hospital completes major upgrade of emergency department facilities and technology.",
        "content": """The emergency department at City General Hospital has completed a comprehensive modernization project, featuring new triage systems, expanded treatment areas, and state-of-the-art medical equipment.

The upgrades are expected to reduce wait times and improve patient care in emergency situations. The department now includes dedicated areas for pediatric emergencies and mental health crisis intervention.""",
        "category": "Facility Update",
        "image_url": "https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg",
        "date": datetime.utcnow() - timedelta(days=22),
        "status": "published",
        "admin_id": 1
    },
    {
        "title": "Robotic Surgery Milestone Achieved",
        "summary": "Hospital celebrates 1000th successful robotic surgery procedure.",
        "content": """City General Hospital has reached a significant milestone with its 1000th successful robotic surgery procedure. The robotic surgery program, which began five years ago, has grown to include procedures across multiple specialties.

The program has demonstrated excellent outcomes, with patients experiencing shorter recovery times and fewer complications compared to traditional surgical approaches.""",
        "category": "Surgery",
        "image_url": "https://images.pexels.com/photos/305566/pexels-photo-305566.jpeg",
        "date": datetime.utcnow() - timedelta(days=25),
        "status": "published",
        "admin_id": 1
    }
]

def populate_news_database():
    db = SessionLocal()
    try:
        # Clear existing articles (optional)
        db.query(NewsArticle).delete()
        
        # Add new articles
        for article_data in news_articles:
            article = NewsArticle(**article_data)
            db.add(article)
        
        db.commit()
        print("Successfully added test news articles to the database!")
    except SQLAlchemyError as e:
        db.rollback()
        print(f"Error populating database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    populate_news_database() 