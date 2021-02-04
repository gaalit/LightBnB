
INSERT INTO users (name, email, password)
VALUES ('Johnny B', 'a@b.c', 'd'),
('Bobby J', 'bobby@geemail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Janice S', 'janice.s@geemail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'Villa Of Dreams', 'description', 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', 'https://images.pexels.com/photos/60217/pexels-photo-60217.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500', 5000, 5, 6, 12, 'Jamaica', 'Beach Rd.', 'Kingston', 'Treasure Beach', 555555, true),
(2, 'Villa Of Rainbows', 'description', 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', 'https://images.pexels.com/photos/60217/pexels-photo-60217.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500', 15000, 15, 16, 15, 'Costa Rica', 'Surf Rd.', 'Santa Teresa', 'Palma', 555554, true),
(3, 'Villa Of Flowers', 'description', 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', 'https://images.pexels.com/photos/60217/pexels-photo-60217.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500', 1000, 2, 2, 1, 'Cuba', 'Havana', 'Sun Rd.', 'San Juan', 555553, true);

INSERT INTO reservations (guest_id, property_id, start_date, end_date) 
VALUES (1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 1, 1, 1, 'message'),
(2, 2, 2, 2, 'message'),
(3, 3, 3, 3, 'message');