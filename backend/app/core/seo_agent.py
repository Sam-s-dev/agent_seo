"""
Autonomous SEO Agent Orchestration Module for RankPilot.
Handles Keyword Research, Content Generation, WordPress Publishing, and SEO Scoring.
"""
import re
import random
import httpx
from typing import Dict, List, Optional
from app.core.security import decrypt_password

class SEOAgent:
    def __init__(self):
        pass

    async def run_audit(self, site_url: str) -> Dict:
        """Simulates crawling and auditing the target site to find indexation,
        existing pages, speed metrics, and SEO score.
        """
        # Simulated crawler results
        existing_pages = [
            {"title": "About Us", "url": f"{site_url}/about/"},
            {"title": "Our Services", "url": f"{site_url}/services/"},
            {"title": "Contact us", "url": f"{site_url}/contact/"},
            {"title": "Blog", "url": f"{site_url}/blog/"}
        ]
        return {
            "site_url": site_url,
            "pages_indexed": 14,
            "page_speed_score": 82,
            "existing_pages": existing_pages,
            "ssl_active": site_url.startswith("https"),
            "robots_txt_exists": True
        }

    async def research_keywords(self, site_url: str) -> List[Dict]:
        """Simulates finding profitable keywords for the target site's niche
        using DataForSEO/SerpAPI format.
        """
        # Mock high potential keywords
        return [
            {"keyword": "best automated seo software", "volume": 1200, "difficulty": 25, "cpc": 3.45},
            {"keyword": "how to automate seo with ai", "volume": 850, "difficulty": 18, "cpc": 2.10},
            {"keyword": "autonomous seo employee agent", "volume": 450, "difficulty": 10, "cpc": 5.80},
            {"keyword": "grow organic traffic with ai", "volume": 1600, "difficulty": 42, "cpc": 1.50}
        ]

    async def generate_article(self, keyword: str, site_url: str, existing_pages: List[Dict]) -> Dict:
        """Simulates LLaMA 3.3 70B article generation with dynamic keyword insertion,
        structured HTML headings, internal linking, and meta tags generation.
        """
        title = f"The Definitive Guide to: {keyword.title()}"
        
        # Build base content structure with H1, H2, H3, intro, body, FAQ, conclusion
        content_intro = f"<p>In today's fast-paced digital world, learning <strong>{keyword}</strong> is essential for growing your business. Traditional methods can be slow and expensive.</p>"
        
        # Inject dynamic internal link to services/about page
        internal_link = ""
        if existing_pages:
            target_page = existing_pages[0]
            internal_link = f'<p>Before we dive deep, check out our <a href="{target_page["url"]}">{target_page["title"]}</a> page to understand how we support businesses.</p>'

        content_body = (
            f"<h2>Why {keyword.title()} Matters</h2>"
            f"<p>Automating your SEO workflows allows businesses to scale content creation, keyword research, and optimization in real time.</p>"
            f"<h3>Key Benefits</h3>"
            f"<ul>"
            f"<li>Cost reduction compared to traditional agencies.</li>"
            f"<li>Rapid scaling of keyword coverage.</li>"
            f"<li>Continuous ranking updates.</li>"
            f"</ul>"
            f"<h2>Frequently Asked Questions</h2>"
            f"<p><strong>Is AI content safe for Google?</strong> Yes, Google rewards high-quality, helpful content regardless of how it is produced.</p>"
            f"<h2>Conclusion</h2>"
            f"<p>Embracing modern automation tools is the easiest way to dominate search engines.</p>"
        )
        
        full_content = f"{content_intro}\n{internal_link}\n{content_body}"
        
        # Calculate score
        score_details = self.calculate_rankpilot_score(full_content, keyword, len(internal_link) > 0)
        
        meta_desc = f"Looking for info about {keyword}? Read our definitive guide to find out everything you need to know today."
        
        return {
            "title": title,
            "content": full_content,
            "meta_title": f"{title} | RankPilot Guide",
            "meta_desc": meta_desc[:160],  # Max 160 chars
            "score": score_details["total_score"],
            "score_metrics": score_details
        }

    def calculate_rankpilot_score(self, content: str, keyword: str, has_internal_links: bool) -> Dict:
        """Calculates SEO score on 100 based on standard guidelines.
        Metrics: Heading structure (20), Word count (25), Keyword density (25), Internal links (15), Readability (15)
        """
        metrics = {
            "headings": 0,
            "word_count": 0,
            "density": 0,
            "internal_links": 15 if has_internal_links else 0,
            "readability": 15
        }
        
        # 1. Heading structure check (Requires H2 and H3)
        if "<h2>" in content:
            metrics["headings"] += 10
        if "<h3>" in content:
            metrics["headings"] += 10
            
        # 2. Word count rating
        words = len(re.findall(r'\w+', content))
        if words >= 1500:
            metrics["word_count"] = 25
        elif words >= 1000:
            metrics["word_count"] = 20
        elif words >= 500:
            metrics["word_count"] = 15
        else:
            metrics["word_count"] = 10
            
        # 3. Keyword Density calculation (Optimal: 1% to 2.5%)
        # Clean html tags for text density check
        text_only = re.sub(r'<[^>]*>', '', content).lower()
        keyword_count = text_only.count(keyword.lower())
        total_words = len(text_only.split())
        
        if total_words > 0:
            density_pct = (keyword_count / total_words) * 100
            if 1.0 <= density_pct <= 2.5:
                metrics["density"] = 25
            elif 0.5 <= density_pct < 1.0 or 2.5 < density_pct <= 4.0:
                metrics["density"] = 15
            else:
                metrics["density"] = 5
        else:
            metrics["density"] = 0
            
        total_score = sum(metrics.values())
        return {
            "total_score": min(total_score, 100),
            **metrics
        }

    async def publish_to_wordpress(
        self, 
        wp_url: str, 
        wp_username: str, 
        wp_app_password_encrypted: str, 
        title: str, 
        content: str, 
        meta_title: str, 
        meta_desc: str,
        status: str = "draft"
    ) -> Optional[int]:
        """Publishes the article to the WordPress REST API.
        Decrypts the password securely first.
        """
        password = decrypt_password(wp_app_password_encrypted)
        
        base_url = wp_url.rstrip("/")
        posts_endpoint = f"{base_url}/wp-json/wp/v2/posts"
        
        # In a real environment, we'd make the post request:
        # auth = (wp_username, password)
        # payload = {
        #     "title": title,
        #     "content": content,
        #     "status": status,
        #     "meta": {"_yoast_wpseo_title": meta_title, "_yoast_wpseo_metadesc": meta_desc}
        # }
        # response = await client.post(posts_endpoint, json=payload, auth=auth)
        # return response.json()["id"]
        
        # Mocking successful WordPress publication and returning post ID
        if "fail" in wp_url:
            return None
        return random.randint(1000, 9999)
